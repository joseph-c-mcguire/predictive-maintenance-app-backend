import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Predictive Maintenance System header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Predictive Maintenance System/i });
  expect(headerElement).toBeInTheDocument();
});
