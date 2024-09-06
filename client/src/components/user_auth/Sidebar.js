import httpClient from "../../httpClient";
import ContentPanel from "./ContentPanel";
import ProtectedComponent from "./ProtectedComponent";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate  } from 'react-router-dom';

//onViewChange parameter for dashboard that will change content panel 
function Sidebar( { onViewChange } ) {
    //route navigator
    const navigate = useNavigate()
    
    //user details 
    const [userInformation, setUserInformation] = useState({
        'user_data': Object(null),
        'user_details_data': Object(null),
        'user_resident_type': String(null)
    });

    //user logout 
    const logoutUser = useCallback(async () => {
        try {
            const resp = await httpClient.delete('/api/user/auth');
            if (resp.status !== 410) {
                alert('Error logging out');
            }
        } catch (e) {
            console.error('Logout error: ', e);
        }
    }, []);

    //set user details from endpoint
    useEffect(() => {
        const getUserInformation = async () => {
            try { 
                const resp = await httpClient.get('/api/user/auth');
                
                if (resp.status !== 200) {
                    alert("error");
                }
                setUserInformation({
                   'user_data': resp.data.res_user_data, 
                   'user_details_data': resp.data.res_user_details_data,
                   'user_resident_type': resp.data.res_user_resident_name
                });
            } catch (error) {
                if (error.response.status===401){
                    alert('session not found');
                    return;
                }
                alert('internal server error');
                return;
            }
        }
        getUserInformation();
    }, []);

    //user logout on click
    const handleLogoutClick = () => {
        navigate('/');
        logoutUser();
    };


    return(
        <ProtectedComponent>
            <aside id="login-sidebar">
                <h4>
                    {userInformation.user_data ? (
                        <>
                            {userInformation.user_data.user_lastname}, {userInformation.user_data.user_firstname} {userInformation.user_data.user_middlename}
                        </>
                    ) : 
                    (
                        <p>
                            Loading user information...
                        </p>
                    )}
                </h4>
                {/* resident type */}
                <h5>
                    {userInformation.user_resident_type}
                </h5>
                {/* location type */}
                <h5>
                    {userInformation.user_details_data.location_type}
                </h5>
                <ul>
                    {userInformation.user_details_data.brgy_street_obj ? (
                    /* if brgy_street_id is not empty */
                        <>
                            <li>
                                Purok: {userInformation.user_details_data.brgy_street_obj.purok}
                            </li>
                            <li>
                                Streetname: {userInformation.user_details_data.brgy_street_obj.street_name}
                            </li>
                        </>
                    ) : userInformation.user_details_data.village_obj ? ( 
                        /* if village_id is not empty */
                        <>
                            <li>
                                Village / Subdivision name: {userInformation.user_details_data.village_obj.village_name} 
                            </li>
                        </>
                    ) : (
                        <li>Loading...</li>
                    )}
                    <li>
                        House no: {userInformation.user_details_data.house_number}
                    </li>
                </ul>
                <button onClick={() => {onViewChange('manage_accounts');}} >
                    Manage Accounts
                </button>

                <button onClick={() => {onViewChange('manage_events');}}>
                    Manage Events
                </button>
                
                <button onClick={() => {onViewChange('manage_posts');}}>
                    Manage Posts
                </button>

                <button onClick={handleLogoutClick}>
                    Logout
                </button>
            </aside>
        </ProtectedComponent>
    );
}

export default Sidebar;