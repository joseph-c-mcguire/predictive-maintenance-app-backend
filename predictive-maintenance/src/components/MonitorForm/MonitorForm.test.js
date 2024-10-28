import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MonitorForm from './MonitorForm';

// Mock axios
jest.mock('axios');

describe('MonitorForm', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test('renders the form and submits data', async () => {
    // Mock the response from the backend
    axios.post.mockResolvedValue({
      data: {
        prediction: 'No Failure',
        drift_detected: false,
        metrics: {
          accuracy: 0.95,
          precision: 0.96,
          recall: 0.94,
          f1_score: 0.95
        }
      }
    });

    render(<MonitorForm />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Air Temperature \[K\]/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Process Temperature \[K\]/i), { target: { value: '310' } });
    fireEvent.change(screen.getByLabelText(/Rotational Speed \[rpm\]/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Torque \[Nm\]/i), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText(/Tool Wear \[min\]/i), { target: { value: '10' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the response to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Predicted Class: No Failure/i)).toBeInTheDocument();
      expect(screen.getByText(/Model Drift Detected: No/i)).toBeInTheDocument();
      expect(screen.getByText(/accuracy: 0.95/i)).toBeInTheDocument();
      expect(screen.getByText(/precision: 0.96/i)).toBeInTheDocument();
      expect(screen.getByText(/recall: 0.94/i)).toBeInTheDocument();
      expect(screen.getByText(/f1_score: 0.95/i)).toBeInTheDocument();
    });

    // Verify the axios post request
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/predict', {
      features: {
        Type: 'M',
        'Air temperature [K]': 300,
        'Process temperature [K]': 310,
        'Rotational speed [rpm]': 1500,
        'Torque [Nm]': 40,
        'Tool wear [min]': 10
      }
    });
  });
});