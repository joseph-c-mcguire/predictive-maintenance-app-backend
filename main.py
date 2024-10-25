from pathlib import Path

import joblib
from flask import Flask, request, jsonify
from pandas import to_pickle, DataFrame, read_csv
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from src.data_utils import (
    load_data, load_config, preprocess_data, select_features,
    train_and_evaluate_model, perform_eda, tune_model,
    interpret_model, monitor_model_performance
)

# yaml path
yaml_path = "config.yaml"
# load config
config = load_config(yaml_path)
# load data
data = load_data(config["data_path"])
# perform EDA
# perform_eda(data)
X = data.drop(config["target_column"], axis=1)
y = data[config["target_column"]]
# train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
# preprocess data
preprocessor, preprocessed_data = preprocess_data(
    X_train, columns_to_drop=config["columns_to_drop"],
    columns_to_scale=config["columns_to_scale"],
    columns_to_encode=config["columns_to_encode"]
)

# select features
selected_features = select_features(
    X_train, y_train, preprocessor=preprocessor)

# train and evaluate model
model_results = train_and_evaluate_model(
    preprocessed_data[:, selected_features], y_train, preprocessor.fit_transform(X_test)[:, selected_features], y_test)
for model_name, result in model_results.items():
    print(f"Model: {model_name}")
    print(result['Classification Report'])
    print(f"ROC AUC: {result['ROC AUC']}\n")

best_rf_model = tune_model(RandomForestClassifier(),
                           config['param_grid'], preprocessed_data, y_train)

model_save_path = Path(config["model_directory"]) / 'best_model.pkl'
print(best_rf_model)
# Save the model
to_pickle(best_rf_model, model_save_path)
# Interpret the model
interpret_model(best_rf_model, preprocessor.fit_transform(
    X_test)[:, selected_features])
# Load the trained model
model = joblib.load(model_save_path)
# Launch flask
app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict equipment failure using the deployed model.

    Request JSON format:
    {
        "features": {
            "temperature": value,
            "vibration": value,
            ...
        }
    }

    Returns:
    JSON response with prediction result.
    """
    data = request.get_json(force=True)
    features = DataFrame(data, index=[0])
    prediction = model.predict(features[:, selected_features])

    return jsonify({'prediction': prediction[0]})


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
    X_new = preprocessor.fit_transform(new_data)[:, selected_features]
    y_new = new_data['failure']

    performance = monitor_model_performance(best_rf_model, X_new, y_new)
    return jsonify({'roc_auc': performance})


if __name__ == '__main__':
    app.run(debug=True)
