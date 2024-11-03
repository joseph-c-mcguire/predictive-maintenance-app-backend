import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Results from './Results';

test('renders Results component with no results', () => {
  act(() => {
    render(<Results result={null} handleNewEntry={() => {}} />);
  });
  expect(screen.getByText(/No results to display/i)).toBeInTheDocument();
});

test('renders Results component with results', () => {
  const result = {
    prediction: 'No Failure',
    metrics: {
      accuracy: 0.95,
      precision: 0.96,
      recall: 0.94,
      f1_score: 0.95
    }
  };

  act(() => {
    render(<Results result={result} handleNewEntry={() => {}} />);
  });
  expect(screen.getByText(/Predicted Class/i)).toBeInTheDocument();
  expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
  expect(screen.getByText(/precision/i)).toBeInTheDocument();
  expect(screen.getByText(/recall/i)).toBeInTheDocument();
  expect(screen.getByText(/f1_score/i)).toBeInTheDocument();
});

test('calls handleNewEntry when Enter New Data button is clicked', () => {
  const handleNewEntry = jest.fn();
  const result = {
    prediction: 'No Failure',
    metrics: {
      accuracy: 0.95,
      precision: 0.96,
      recall: 0.94,
      f1_score: 0.95
    }
  };

  act(() => {
    render(<Results result={result} handleNewEntry={handleNewEntry} />);
  });
  fireEvent.click(screen.getByText(/Enter New Data/i));
  expect(handleNewEntry).toHaveBeenCalledTimes(1);
});
