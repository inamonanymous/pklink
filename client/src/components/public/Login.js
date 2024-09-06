import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
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

    const handleSubmit = async(e) => {
      e.preventDefault();
      if (!data.req_user_username || !data.req_user_password){
        return;
      } 
      logInUser();
    };

    const logInUser = async() => {

      try {
        const resp = await httpClient.post('/api/user/auth', data);
  
        if (resp.status !== 200) {
          alert("wrong response status");
          return;
        } 
          navigate('/user/dashboard');
      } catch (error) {
        if (error.status===406){
          alert("wrong credentials");
          return;
        }
        alert("Internal server error");
        return;
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
          <button>
            Submit
          </button>
        </form>
      </div>
    );
  }
  
  export default Login;
  