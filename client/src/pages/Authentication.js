import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../components/public/Login';
import Register from '../components/public/Register';
import '../css/Authentication.css'
import pk_logo_black from  '../img/pk_logo_black.svg';
import text_logo from  '../img/text_logo.svg';

function Authentication() {
  const location = useLocation();
  const isLoggingIn = location.state?.isLoggingIn ?? true;  // default to true if not passed

  return (
    <>
      <section id="authentication">
        <div>  
          <aside>
              <div>
                  <div className='imgs-con flex'>
                    <div className='img-con'>
                        <img src={pk_logo_black} alt="" />
                    </div>
                    <div className='img-con'>
                        <img src={text_logo} alt="" />
                    </div>
                  </div>
                  
                  <div className='text-con'>
                    <h4>
                      {isLoggingIn ? 'Nice to see you again' : 'Join our community'}
                    </h4>
                  </div>
                  
                  <div className='form-con'>
                    {isLoggingIn ? <Login /> : <Register />}
                  </div>
              </div>
            <footer>
              <p>© Pamahalaang Barangay ng Puting Kahoy 2024</p>
            </footer>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Authentication;
