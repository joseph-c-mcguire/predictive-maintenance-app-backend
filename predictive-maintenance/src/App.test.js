import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

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
  render(<App />);
  fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'M' } });
  fireEvent.change(screen.getByLabelText(/Air Temperature \[K\]/i), { target: { value: '300' } });
  fireEvent.change(screen.getByLabelText(/Process Temperature \[K\]/i), { target: { value: '310' } });
  fireEvent.change(screen.getByLabelText(/Rotational Speed \[rpm\]/i), { target: { value: '1500' } });
  fireEvent.change(screen.getByLabelText(/Torque \[Nm\]/i), { target: { value: '40' } });
  fireEvent.change(screen.getByLabelText(/Tool Wear \[min\]/i), { target: { value: '10' } });

  fireEvent.click(screen.getByText(/Submit/i));

  await waitFor(() => {
    expect(screen.getByText(/Predicted Class: No Failure/i)).toBeInTheDocument();
  });
});
