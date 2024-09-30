import httpClient from "../../httpClient";
import ContentPanel from "./ContentPanel";
import ProtectedComponent from "./ProtectedComponent";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate  } from 'react-router-dom';

//onViewChange parameter for dashboard that will change content panel 
function Sidebar( { onViewChange, priveleges } ) {
    //route navigator
    const navigate = useNavigate()
    
    //user details 
    const [userInformation, setUserInformation] = useState({
        'user_data': Object(null),
        'user_details_data': Object(null),
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
                });
                console.log(priveleges);
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
                    {priveleges.type_name}
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
                {priveleges?.view_accounts ? (
                    <button onClick={() => {onViewChange('manage_accounts');}} >
                        Manage Accounts
                    </button>
                ) : null}
                {priveleges?.manage_event ? (
                    <button onClick={() => {onViewChange('manage_event');}}>
                    Manage Events
                </button>
                ) : null}
                {priveleges?.manage_post ? (
                    <button onClick={() => {onViewChange('manage_posts');}}>
                    Manage Posts
                </button>
                ): null}
                
                
                <button onClick={() => {onViewChange('manage_my_account');}}>
                    Manage My Account
                </button>
                
                <button onClick={handleLogoutClick}>
                    Logout
                </button>
            </aside>
    );
}

export default Sidebar;