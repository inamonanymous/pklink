import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
      <section>
        <Link to="/login">
            <button>
                Login
            </button>
        </Link>
        <Link to="/register">
            <button>
                Register
            </button>
        </Link>
      </section>
    );
  }
  
  export default LandingPage;
  