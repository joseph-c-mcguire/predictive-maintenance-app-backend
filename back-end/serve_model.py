import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pandas import DataFrame, read_csv
import joblib

from src.data_utils import load_model, monitor_model_performance, load_config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the trained model and ModelMonitor
model_path = os.getenv('MODEL_PATH', r'models\best_model.pkl')
monitor_path = os.getenv('MONITOR_PATH', r'models\model_monitor.pkl')
config_path = os.getenv("CONFIG_PATH", r'config.yaml')
logger.info(f"Loading the trained model from {model_path}")
pipeline = load_model(model_path)
logger.info(f"Loading the ModelMonitor from {monitor_path}")
monitor = joblib.load(monitor_path)
logger.info(f"Loading the Configuration File from {config_path}")
config = load_config(config_path)


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
    prediction = pipeline.predict(features)

    # Monitor model performance
    # metrics, drift_status = monitor.monitor(X_new=features, y_true=prediction)
    # logger.info(f"Prediction metrics: {metrics}")
    # logger.info(f"Drift detected: {drift_status}")

    return jsonify({'prediction': prediction[0]})


# @app.route('/monitor', methods=['POST'])
# def monitor_performance():
#     """
#     Monitor model performance on new data.

#     Request JSON format:
#     {
#         "data_path": "path_to_new_data.csv"
#     }

#     Returns:
#     JSON response with model performance metrics and drift status.
#     """
#     data = request.get_json(force=True)
#     new_data_path = data['data_path']
#     new_data = read_csv(new_data_path)
#     X_new = pipeline.transform(new_data)
#     y_new = new_data[config["target_column"]]
#     performance = monitor_model_performance(pipeline, X_new, y_new)
#     drift_status = monitor.check_feature_drift(X_new)
#     return jsonify({'roc_auc': performance, 'drift_detected': drift_status})


if __name__ == '__main__':
    logger.info("Starting Flask app")
    app.run(host='0.0.0.0', port=5000, debug=True)
