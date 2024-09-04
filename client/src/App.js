import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './components/public/Register';
import Login from './components/public/Login';
import Dashboard from './components/user_auth/Dashboard';

function App() {
  return (
      <>
        <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" exact element={<Register />} />
              <Route path="/login" exact element={<Login />} />
              
              <Route path="/user/dashboard" exact element={<Dashboard />} />
            </Routes>
        </Router>
      </>
  );
}

export default App;
