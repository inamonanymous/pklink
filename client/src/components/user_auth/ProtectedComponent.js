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

                //if response does not qualify redirect to login
                if (resp.status !== 200) {
                    navigate('/login');
                } else {
                    //if response does qualify show component
                    const data = resp.data;
                    setIsLoggedIn(true);
                    setUserPriveleges({
                        'username': data['username'],
                        'resident_id': data['resident_id'],
                        'type_name': data['type_name'],
                        'view_accounts': data['view_accounts'],
                        'control_accounts': data['control_accounts'],
                        'add_announcement': data['add_announcement'],
                        'manage_announcement': data['manage_announcement'],
                        'add_event': data['add_event'],
                        'manage_event': data['manage_event'],
                        'add_post': data['add_post'],
                        'manage_post': data['manage_post'],
                        'partial_admin': data['partial_admin'],
                    });
                }

            } catch (error) {
                if(error.response.status===406){
                    setIsLoggedIn(false);
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

    
    return isLoggedIn && typeof children === 'function' ? children(userPriveleges) : null;
};

export default ProtectedComponent;