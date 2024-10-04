import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../components/public/Login';
import Register from '../components/public/Register';
import '../css/Authentication.css'
import pk_logo_black from  '../img/pk_logo_black.svg';
import text_logo from  '../img/text_logo.svg';

function Authentication() {
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(Boolean);  // Initialize with true by default
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (location.state?.isLoggingIn !== undefined) {
      setIsLoggingIn(location.state.isLoggingIn);
    }
  }, [location.state]);

  const handleSwitcher = () => {
    setAnimating(true);  // Trigger animation
    setTimeout(() => {
      setIsLoggingIn(prevState => !prevState);
      setAnimating(false);  // Reset animation state
    }, 500);  // Time must match your CSS transition duration
  };

  const handleRegistrationSuccess = () => {
    setIsLoggingIn(true); // Set isLoggingIn to true after successful registration
  };

  return (
    <>
      <section id="authentication">
        <div>  
          <aside className={`${animating ? 'slide-out' : 'slide-in'}`}>
              <div className='flex-col'>
                  <a href="/">
                    <div className='imgs-con flex'>
                      <div className='img-con'>
                          <img src={pk_logo_black} alt="" />
                      </div>
                      <div className='img-con'>
                          <img src={text_logo} alt="" />
                      </div>
                    </div>
                  </a>
                  
                  <div className='text-con'>
                    <h4>
                      {isLoggingIn ? 'Nice to see you again' : 'Join our community'}
                    </h4>
                  </div>
                  
                  <div className='form-con'>
                    {isLoggingIn ? <Login /> : <Register onRegistrationSuccess={handleRegistrationSuccess} />}
                  
                    <div className='text-con switcher flex'>
                      {isLoggingIn ? (
                        <>
                          <p>
                            Dont have an account?  
                          </p>
                          <a 
                            href="#"
                            onClick={handleSwitcher}
                          >
                            Sign up now!
                          </a>
                        </>
                      ) : (
                        <>
                          <p>
                            Already have an account? 
                          </p>
                          <a 
                            href="#"
                            onClick={handleSwitcher}
                          >
                            Sign in
                          </a>
                        </>
                      )}
                    </div>
                  </div>
              <footer>
                <p>© Pamahalaang Barangay ng Puting Kahoy 2024</p>
              </footer>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Authentication;
