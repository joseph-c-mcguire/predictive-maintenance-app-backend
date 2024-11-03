import React from 'react';
import { render, screen, act } from '@testing-library/react';
import DataDescription from './DataDescription';

test('renders DataDescription component', () => {
  act(() => {
    render(<DataDescription />);
  });
  expect(screen.getByText(/About Dataset/i)).toBeInTheDocument();
  expect(screen.getByText(/Machine Predictive Maintenance Classification Dataset/i)).toBeInTheDocument();
  expect(screen.getByText(/The dataset consists of 10,000 data points stored as rows with 14 features in columns:/i)).toBeInTheDocument();
});
