import React, { Children, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';

const ProtectedComponent = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPriveleges, setUserPriveleges] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

useEffect(() => {
        const checkSession = async () => {
            try {
                const resp = await httpClient.get('/api/user/check_session');

                // If response does not qualify, redirect to login
                if (resp.status !== 200) {
                    navigate('/authentication');
                } else {
                    // If response qualifies, show the component
                    const data = resp.data;
                    setIsLoggedIn(true);
                    setUserPriveleges({
                        username: data.username,
                        resident_id: data.resident_id,
                        type_name: data.type_name,
                        view_accounts: data.view_accounts,
                        control_accounts: data.control_accounts,
                        add_announcement: data.add_announcement,
                        manage_announcement: data.manage_announcement,
                        add_event: data.add_event,
                        manage_event: data.manage_event,
                        add_post: data.add_post,
                        manage_post: data.manage_post,
                        partial_admin: data.partial_admin,
                    });
                }
            } catch (error) {
                if (error.response.status === 406) {
                    setIsLoggedIn(false);
                    alert('Session not found');
                    navigate('/authentication');
                } else {
                    console.error('Unexpected error checking session:', error);
                    navigate('/authentication');
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Initial session check
        checkSession();

        // Set interval to check session every 5 minutes
        const intervalId = setInterval(checkSession, 300000); // 300,000 ms = 5 minutes

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [navigate]);
    if (isLoading) {
        return <div>Loading...</div>; // Optionally show a loading state
    }

    
    return isLoggedIn && typeof children === 'function' ? children(userPriveleges) : null;
};

export default ProtectedComponent;