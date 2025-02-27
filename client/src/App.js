import './css/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Authentication from './pages/Authentication';
import NotFound from './NotFound';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
