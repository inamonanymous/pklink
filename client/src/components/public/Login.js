import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import httpClient from '../../httpClient';
import Swal from 'sweetalert2';
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
        document.body.style.cursor = 'wait';
        const resp = await httpClient.post('/api/user/auth', data);

        if (resp.status !== 200) {
          Swal.fire('Failed!', 'Login Failed.', 'failed');
          return;
        }
        navigate('/user/dashboard');
        Swal.fire({
          title: "Login Complete!",
          html: "Redirecting to dashboard",
          timer: 1000,
          timerProgressBar: true
        });
      } catch (error) {
        if (error.status===406){
          Swal.fire('Failed!', 'Wrong credentials', 'failed');
          return;
        }
        else if (error.status===410){
          Swal.fire('Failed!', 'Wrong credentials', 'failed');
          return;
        }
        Swal.fire('Error!', 'Internal server error', 'error');
        return;
      } finally {
        document.body.style.cursor = 'default';
      }
    };
    return (
      <>
        <form onSubmit={handleSubmit} className='flex-col'>
          <div className='input-con flex-col'>
            <label for="req_user_username">Username</label>
            <input 
              type="text"
              name="req_user_username" 
              placeholder="username"
              value={data.req_user_username}
              onChange={handleChange}
            />
          </div>
          <div className='input-con flex-col'>
            <label for="req_user_username">Password</label>
            <input
              type="password" 
              name="req_user_password" 
              placeholder="password"
              value={data.req_user_password}
              onChange={handleChange}
            />  
          </div>
          <div className='text-con'>
            <a href="">Forgot password?</a>
          </div>
          <button 
            className='button'
            type='submit'>
            Sign In
          </button>
        </form>
      </>
      
    );
  }
  
  export default Login;
  