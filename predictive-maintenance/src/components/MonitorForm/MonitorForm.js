import React, { useState } from 'react';
import axios from 'axios';

const MonitorForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    airTemperature: '',
    processTemperature: '',
    rotationalSpeed: '',
    torque: '',
    toolWear: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        features: {
          Type: formData.type,
          'Air temperature [K]': parseFloat(formData.airTemperature),
          'Process temperature [K]': parseFloat(formData.processTemperature),
          'Rotational speed [rpm]': parseInt(formData.rotationalSpeed, 10),
          'Torque [Nm]': parseFloat(formData.torque),
          'Tool wear [min]': parseInt(formData.toolWear, 10)
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error predicting model performance:', error);
    }
  };

  return (
    <div>
      <h2>Monitor Model Performance</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
        </label>
        <label>
          Air Temperature [K]:
          <input
            type="text"
            name="airTemperature"
            value={formData.airTemperature}
            onChange={handleChange}
          />
        </label>
        <label>
          Process Temperature [K]:
          <input
            type="text"
            name="processTemperature"
            value={formData.processTemperature}
            onChange={handleChange}
          />
        </label>
        <label>
          Rotational Speed [rpm]:
          <input
            type="text"
            name="rotationalSpeed"
            value={formData.rotationalSpeed}
            onChange={handleChange}
          />
        </label>
        <label>
          Torque [Nm]:
          <input
            type="text"
            name="torque"
            value={formData.torque}
            onChange={handleChange}
          />
        </label>
        <label>
          Tool Wear [min]:
          <input
            type="text"
            name="toolWear"
            value={formData.toolWear}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <h3>Results</h3>
          <p>Predicted Class: {result.prediction}</p>
          <p>Model Drift Detected: {result.drift_detected ? 'Yes' : 'No'}</p>
          <h4>Metrics:</h4>
          <ul>
            {Object.entries(result.metrics).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonitorForm;