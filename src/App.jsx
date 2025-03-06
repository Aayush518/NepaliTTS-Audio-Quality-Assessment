import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SurveyPage from './pages/SurveyPage';
import './App.css';
// Import styles in the correct cascade order
import './styles/GradientEffects.css'; // First import base gradient effects
import './styles/SurveyPage.css';     // Then import page-specific styles
import './styles/ThankYou.css';       // Finally import component-specific styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/survey" element={<SurveyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
