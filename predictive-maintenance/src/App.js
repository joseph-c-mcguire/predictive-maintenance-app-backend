import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonitorForm from './components/MonitorForm/MonitorForm';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<MonitorForm />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;