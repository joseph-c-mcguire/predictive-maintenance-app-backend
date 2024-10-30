import React, { useState, useEffect } from 'react';
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
  const [backendUrl, setBackendUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL;
    setBackendUrl(url);
    console.log("Backend URL from env: ", url); // Log the backend URL for debugging
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const { type, airTemperature, processTemperature, rotationalSpeed, torque, toolWear } = formData;
    if (!type || !airTemperature || !processTemperature || !rotationalSpeed || !torque || !toolWear) {
      return false;
    }
    if (isNaN(parseFloat(airTemperature)) || isNaN(parseFloat(processTemperature)) || isNaN(parseInt(rotationalSpeed, 10)) || isNaN(parseFloat(torque)) || isNaN(parseInt(toolWear, 10))) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fill in all fields correctly.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backendUrl}/predict`, {
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
      setError('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    setFormData({
      type: '',
      airTemperature: '',
      processTemperature: '',
      rotationalSpeed: '',
      torque: '',
      toolWear: ''
    });
    setResult(null);
  };

  return (
    <div>
      <h2>Monitor Model Performance</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="H">H</option>
          </select>
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
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h3>Results</h3>
          <p>Predicted Class: {result.prediction}</p>
          {/* <p>Model Drift Detected: {result.drift_detected ? 'Yes' : 'No'}</p> */}
          <h4>Metrics:</h4>
          <ul>
            {result.metrics && Object.entries(result.metrics).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
          <button onClick={handleNewEntry}>Enter New Data</button>
        </div>
      )}
    </div>
  );
};

export default MonitorForm;
