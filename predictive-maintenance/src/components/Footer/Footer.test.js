import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Footer from './Footer';

test('renders Footer component', () => {
  act(() => {
    render(<Footer />);
  });
  expect(screen.getByText(/© 2023 Predictive Maintenance System/i)).toBeInTheDocument();
});
