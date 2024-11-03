import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Header from './Header';

test('renders Header component', () => {
  act(() => {
    render(<Header />);
  });
  expect(screen.getByText(/Predictive Maintenance System/i)).toBeInTheDocument();
});
