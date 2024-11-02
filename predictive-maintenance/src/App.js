import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonitorForm from './components/MonitorForm/MonitorForm';
import Results from './components/Results/Results';
import DataDescription from './components/DataDescription/DataDescription';
import './App.css'; // Import the CSS file

const App = () => {
  const [result, setResult] = useState(null);

  const handleNewEntry = () => {
    setResult(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <DataDescription />
          <div className="content-row">
            <MonitorForm setResult={setResult} />
            <Results result={result} handleNewEntry={handleNewEntry} />
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;