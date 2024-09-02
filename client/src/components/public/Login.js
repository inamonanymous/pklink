import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import httpClient from '../../httpClient';
function Login() {
    const [data, setData]= useState({
        req_user_username: '',
        req_user_password: ''
    }); 
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!data.req_user_username || !data.req_user_password){
        return;
      } 
    };
    const logInUser = async() => {
      console.log(data.req_user_username, data.req_user_password);

      const resp = await httpClient.post('/api/user/auth', data);
      console.log(resp.data);

      if (resp.status !== 200) {
    
        navigate('/login');
      } else {
        navigate('/user/dashboard');
      }
    };
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input 
          type="text"
            name="req_user_username" 
            placeholder="email"
            value={data.req_user_username}
            onChange={handleChange}
          />
          <input
          type="password" 
            name="req_user_password" 
            placeholder="password"
            value={data.req_user_password}
            onChange={handleChange}
          />

          
          <button onClick={() => logInUser()}>
            Submit
          </button>
        </form>
      </div>
    );
  }
  
  export default Login;
  