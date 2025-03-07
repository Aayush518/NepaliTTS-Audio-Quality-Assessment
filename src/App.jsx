import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SurveyPage from './pages/SurveyPage';
import NepaliThemeHelper from './components/NepaliThemeHelper';
import './App.css';
import './styles/GradientEffects.css';
import './styles/SurveyPage.css';
import './styles/ThankYou.css';

function App() {
  return (
    <Router>
      <NepaliThemeHelper />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/survey" element={<SurveyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
