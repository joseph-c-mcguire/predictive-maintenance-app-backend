import logging
import argparse
from flask import Flask, request, jsonify
from pandas import DataFrame, read_csv
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

from src.data_utils import (
    load_data, load_config, preprocess_data, select_features,
    train_and_evaluate_model, perform_eda, tune_model,
    interpret_model, monitor_model_performance, save_model, load_model,
    get_model
)

from src.ModelMonitor import ModelMonitor

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)


def main(config_path: str):
    # Load config
    logger.info("Loading configuration")
    config = load_config(config_path)
    if not config:
        logger.error("Failed to load configuration. Exiting.")
        exit(1)

    # Load data
    logger.info("Loading data")
    data = load_data(config["data_path"])
    if data.empty:
        logger.error("Failed to load data. Exiting.")
        exit(1)

    # Prepare features and target
    logger.info("Preparing features and target")
    X = data.drop(config["target_column"], axis=1)
    y = data[config["target_column"]]

    # Train-test split
    logger.info("Splitting data into train and test sets")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, **config.get("train_test_split", {}))

    # Preprocess data using Pipeline
    logger.info("Setting up preprocessing pipeline")
    preprocessor = ColumnTransformer(
        transformers=[
            ('drop_columns', 'drop', config.get("columns_to_drop", [])),
            ('scale_columns', StandardScaler(),
             config.get("columns_to_scale", [])),
            ('encode_columns', OneHotEncoder(),
             config.get("columns_to_encode", []))
        ]
    ).fit(X=X_train, y=y_train)
    # Process data
    pro_X_train, pro_X_test = preprocessor.transform(
        X_train), preprocessor.transform(X_test)
    # Define models and their hyperparameter grids
    models = {
        model: get_model(**meta_params) for model, meta_params in config["models"].items()
    }

    # Train and evaluate model
    logger.info("Training and evaluating models")
    results = train_and_evaluate_model(
        pro_X_train, y_train, pro_X_test, y_test, models)
    for model_name, result in results.items():
        logger.info(f"Model: {model_name}")
        logger.info(result['Classification Report'])
        logger.info(f"ROC AUC: {result['ROC AUC']}")

    # Tune model
    logger.info("Tuning models")
    best_model = tune_model(
        models, config["param_grids"], pro_X_train, y_train)
    logger.info(f"Best model: {best_model}")

    # Save the model
    logger.info("Saving the best model")
    save_model(best_model, 'best_model.pkl')

    # Interpret the model
    logger.info("Interpreting the model")
    interpret_model(best_model, pro_X_test)

    # Load the trained model
    logger.info("Loading the trained model")
    model = load_model('best_model.pkl')

    # Initialize ModelMonitor
    monitor = ModelMonitor(model, pro_X_train)

    @app.route('/predict', methods=['POST'])
    def predict():
        """
        Predict equipment failure using the deployed model.

        Request JSON format:
        {
            "features": {
                "Type": "value",
                "Air temperature [K]": value,
                "Process temperature [K]": value,
                "Rotational speed [rpm]": value,
                "Torque [Nm]": value,
                "Tool wear [min]": value
            }
        }

        Returns:
        JSON response with prediction result.
        """
        data = request.get_json(force=True)
        features = DataFrame(data['features'], index=[0])
        prediction = model.predict(features)

        # Monitor model performance
        metrics, drift_status = monitor.monitor(features, prediction)
        logger.info(f"Prediction metrics: {metrics}")
        logger.info(f"Drift detected: {drift_status}")

        return jsonify({'prediction': prediction[0], 'metrics': metrics, 'drift_detected': drift_status})

    @app.route('/monitor', methods=['POST'])
    def monitor():
        """
        Monitor model performance on new data.

        Request JSON format:
        {
            "data_path": "path_to_new_data.csv"
        }

        Returns:
        JSON response with model performance metrics.
        """
        data = request.get_json(force=True)
        new_data_path = data['data_path']
        new_data = read_csv(new_data_path)
        X_new = preprocessor.transform(new_data)
        y_new = new_data[config["target_column"]]

        performance = monitor_model_performance(best_model, X_new, y_new)
        return jsonify({'roc_auc': performance})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Predictive Maintenance CLI")
    parser.add_argument('--config', type=str, required=True,
                        help='Path to the configuration file')
    args = parser.parse_args()
    main(args.config)
    logger.info("Starting Flask app")
    app.run(host='0.0.0.0', port=5000, debug=True)
