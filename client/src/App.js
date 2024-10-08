import './css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Authentication from './pages/Authentication';
import NotFound from './NotFound';
function App() {
  return (
      <>
        <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              <Route path="/authentication" exact element={<Authentication isLogIn={true}/>} />
              <Route path="/user/dashboard" exact element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
      </>
  );
}

export default App;
