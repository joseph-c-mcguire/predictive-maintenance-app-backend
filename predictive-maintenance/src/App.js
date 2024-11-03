import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonitorForm from './components/MonitorForm/MonitorForm';
import Results from './components/Results/Results';
import DataDescription from './components/DataDescription/DataDescription';
import InteractiveDashboard from './components/InteractiveDashboard/InteractiveDashboard';
import DiagnosticPlots from './components/DiagnosticPlots/DiagnosticPlots';
import './App.css'; // Import the CSS file
import './components/InteractiveDashboard/InteractiveDashboard.css'; // Import the new CSS file
import './components/DiagnosticPlots/DiagnosticPlots.css'; // Import the new CSS file

const App = () => {
  const [result, setResult] = useState(null);
  const [probabilities, setProbabilities] = useState([]);
  const [data, setData] = useState([]);

  const handleNewEntry = () => {
    setResult(null);
    setProbabilities([]);
  };

  // Example function to simulate setting probabilities
  const simulateProbabilities = () => {
    const exampleProbabilities = [0.1, 0.4, 0.6, 0.8, 0.9];
    console.log('Setting probabilities:', exampleProbabilities); // Log the example probabilities
    setProbabilities(exampleProbabilities); // Example probabilities
  };

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:5000/data')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <DataDescription />
          <InteractiveDashboard data={data} />
          {/* <DiagnosticPlots data={data} /> */}
          <div className="content-row">
            <MonitorForm setResult={setResult} />
            <Results result={result} handleNewEntry={handleNewEntry} />
          </div>
          <button onClick={simulateProbabilities}>Simulate Probabilities</button> {/* Add this button for testing */}
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;