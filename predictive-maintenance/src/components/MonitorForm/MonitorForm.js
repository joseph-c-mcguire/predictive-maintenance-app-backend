import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MonitorForm.css'; // Import the CSS file

const MonitorForm = ({ setResult }) => {
  const [formData, setFormData] = useState({
    type: '',
    airTemperature: '',
    processTemperature: '',
    rotationalSpeed: '',
    torque: '',
    toolWear: ''
  });
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fill in all fields.');
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

  return (
    <div className="monitor-form-container">
      <h2>Monitor Model Performance</h2>
      <form onSubmit={handleSubmit} className="monitor-form">
        <div className="form-group">
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="H">H</option>
          </select>
        </div>
        <div className="form-group">
          <label>Air Temperature [K]:</label>
          <input
            type="text"
            name="airTemperature"
            value={formData.airTemperature}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Process Temperature [K]:</label>
          <input
            type="text"
            name="processTemperature"
            value={formData.processTemperature}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Rotational Speed [rpm]:</label>
          <input
            type="text"
            name="rotationalSpeed"
            value={formData.rotationalSpeed}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Torque [Nm]:</label>
          <input
            type="text"
            name="torque"
            value={formData.torque}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tool Wear [min]:</label>
          <input
            type="text"
            name="toolWear"
            value={formData.toolWear}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MonitorForm;