import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const DiagnosticPlots = ({ data }) => {
  const [pcaData, setPcaData] = useState([]);
  const [decisionBoundary, setDecisionBoundary] = useState({ x: [], y: [], z: [] });

  useEffect(() => {
    if (data.length > 0) {
      // Fetch PCA-transformed data and decision boundary from the backend
      fetch(`${process.env.REACT_APP_BACKEND_URL}/pca-decision-boundary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })
        .then(response => response.json())
        .then(result => {
          setPcaData(result.pca_data);
          setDecisionBoundary(result.decision_boundary);
        })
        .catch(error => console.error('Error fetching PCA data and decision boundary:', error));
    }
  }, [data]);

  return (
    <div className="diagnostic-plots-container">
      <h2>Model Probability Plots</h2>
      <Plot
        data={[
          {
            x: pcaData.map(d => d[0]),
            y: pcaData.map(d => d[1]),
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'blue' },
          },
          {
            x: decisionBoundary.x,
            y: decisionBoundary.y,
            z: decisionBoundary.z,
            type: 'contour',
            colorscale: 'Jet',
          },
        ]}
        layout={{ title: 'Model Decision Boundary (PCA Projection)' }}
      />
    </div>
  );
};

export default DiagnosticPlots;