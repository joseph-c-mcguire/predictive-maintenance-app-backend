import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pandas import DataFrame
import joblib

from src.data_utils import load_model, load_config

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

    # Map prediction to "Failed" or "Not Failed"
    prediction_label = "Failed" if prediction[0] == 1 else "Not Failed"

    # Monitor model performance
    # metrics, drift_status = monitor.monitor(X_new=features, y_true=prediction)
    # logger.info(f"Prediction metrics: {metrics}")
    # logger.info(f"Drift detected: {drift_status}")

    # JSON doesn't recognize numpy types, so we need to convert the prediction to a Python type
    return jsonify({'prediction': prediction_label})


if __name__ == '__main__':
    logger.info("Starting Flask app")
    app.run(host='0.0.0.0', port=5000, debug=True)
