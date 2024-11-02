import React from 'react';
import './Results.css'; // Import the CSS file

const Results = ({ result, handleNewEntry }) => {
  return (
    <div className="results-container">
      {result ? (
        <div className="results">
          <h3>Results</h3>
          <p>Predicted Class: {result.prediction}</p>
          <h4>Metrics:</h4>
          <ul>
            {result.metrics && Object.entries(result.metrics).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
          <button onClick={handleNewEntry} className="new-entry-button">Enter New Data</button>
        </div>
      ) : (
        <p>No results to display.</p>
      )}
    </div>
  );
};

export default Results;