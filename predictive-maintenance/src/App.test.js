import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

test('renders Predictive Maintenance System header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Predictive Maintenance System/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders DataDescription component', () => {
  render(<App />);
  const dataDescriptionElement = screen.getByText(/About Dataset/i);
  expect(dataDescriptionElement).toBeInTheDocument();
});

test('submits the form and displays results', async () => {
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

  await act(async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Air Temperature \[K\]/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Process Temperature \[K\]/i), { target: { value: '310' } });
    fireEvent.change(screen.getByLabelText(/Rotational Speed \[rpm\]/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Torque \[Nm\]/i), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText(/Tool Wear \[min\]/i), { target: { value: '10' } });

    fireEvent.click(screen.getByText(/Submit/i));
  });

  await waitFor(() => {
    expect(screen.getByText(/Predicted Class/i)).toBeInTheDocument();
  });
});
