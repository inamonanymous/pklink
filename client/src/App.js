import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Register from './user_auth/Register';
import Login from './user_auth/Login';

function App() {
  return (
      <>
        <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" exact element={<Register />} />
              <Route path="/login" exact element={<Login />} />
            </Routes>
        </Router>
      </>
  );
}

export default App;
