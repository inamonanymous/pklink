import React from 'react';
import { Link } from 'react-router-dom';
import pk_logo from '../img/pk_logo.svg'
import pk_tree from '../img/pk_tree.svg'
import '../index.css';
function LandingPage() {
    return (
      <>
        <header id='header-public' className='sticky'>
          <div className='flex'>

            <div className='img-con'>
              <img src={pk_logo}/>
            </div>

            <nav className='stroke'>
              <ul className='flex'>
                <li>
                  <a href="">
                    NEWS
                  </a>
                </li>
                <li>
                  <a href="">
                    
                  EVENTS
                  </a>
                </li>
                <li>
                  <a href="">  
                    BLOGS
                  </a>
                </li>
                <li>
                  <a href="">
                    ABOUT US
                  </a>
                </li>
              </ul>
            </nav>

            <div className='buttons flex'>
              <Link to="/login">
                  <a className='button'>
                      Login
                  </a>
              </Link>
              <Link to="/register">
                  <a className='button alt-2'>
                      Register
                  </a>
              </Link>
            </div>
          </div>
        </header>

        <section id='banner-public'>
          <div>
            <div className='text-con'>
              <h1>Your Community, <br/> Your Platform</h1>
              <h3>Connect, collaborate, and contribute to <br/> Brgy. Puting Kahoy's growth</h3>
            </div>

            <div className='img-con'>
              <img src={pk_tree} />
            </div>
          </div>
        </section>
      </>
    );
  }
  
  export default LandingPage;
  