import React, { Children, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';

const ProtectedComponent = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const resp = await httpClient.get('/api/user/check_session');

                //if response does not qualify redirect to login
                if (resp.status !== 200 || !resp.data.is_authenticated) {
                    navigate('/login');
                } else {
                    //if response does qualify show component
                    setIsAuthenticated(true);
                }

            } catch (error) {
                console.error('Error checking session:', error);
                navigate('/login');
            }
            if (!isAuthenticated) {
                return <div>Loading...</div>; // Show loading state while checking authentication
            }
        };
        checkSession();
    }, [navigate]); // Omitting `history` here

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedComponent;