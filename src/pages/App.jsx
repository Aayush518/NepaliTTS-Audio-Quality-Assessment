import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import SurveyPage from './SurveyPage';
import NepaliThemeHelper from '../components/NepaliThemeHelper';

function App() {
  return (
    <Router>
      <NepaliThemeHelper /> {/* Apply Nepali theme colors to SVGs and elements */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/survey" element={<SurveyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
