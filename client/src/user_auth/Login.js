import React, { useState } from 'react';
import axios from 'axios';
function Login() {
    const [data, setData]= useState({
        req_user_email: '',
        req_user_password: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!data.req_user_email || !data.req_user_password){
        return;
      } 

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(data.req_user_email)) {
        return;
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:5001/api/user/auth',
            data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.error('Error saving student data:', response);
      } catch (error) {
        console.error('Error saving student data:', error);
      }
    };
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input 
          type="text"
            name="req_user_email" 
            placeholder="email"
            value={data.req_user_email}
            onChange={handleChange}
          />
          <input
          type="password" 
            name="req_user_password" 
            placeholder="password"
            value={data.req_user_password}
            onChange={handleChange}
          />

          
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
  
  export default Login;
  