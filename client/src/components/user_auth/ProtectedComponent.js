import React, { Children, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';

const ProtectedComponent = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const resp = await httpClient.get('/api/user/check_session');

                //if response does not qualify redirect to login
                if (resp.status !== 200 || !resp.data.is_authenticated) {
                    navigate('/login');
                } else if(resp.status===401) {
                    alert('user unauthorized');
                    setIsAuthenticated(false);
                    navigate('/login');
                } else {
                    //if response does qualify show component
                    setIsAuthenticated(true);
                }

            } catch (error) {
                if(error.response.status && error.response.status===401){
                    setIsAuthenticated(false);
                    alert('session not found');
                    navigate('/login');
                }
                console.error('Unexpected error checking session:', error);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
            
        };
        checkSession();
    }, [navigate]); // Omitting `history` here

    if (isLoading) {
        return <div>Loading...</div>; // Optionally show a loading state
    }
    return (
        <>
            {isAuthenticated ? children : null}
        </>
    );
};

export default ProtectedComponent;