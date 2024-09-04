import httpClient from "../../httpClient";
import ProtectedComponent from "./ProtectedComponent";
import { useState, useEffect, useCallback } from "react";
import { useNavigate  } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate()

    //user details 
    const [userInformation, setUserInformation] = useState({
        'user_data': Object(null),
        'user_details_data': Object(null)
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
            const resp = await httpClient.get('/api/user/auth');
            
            if (resp.status !== 200) {
                alert("error");
            }
            setUserInformation({
               'user_data': resp.data.res_user_data, 
               'user_details_data': resp.data.res_user_details_data
            });
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
            {/* resident id */}
            <h5>
                {userInformation.user_data.resident_type_object.resident_type_name} 
            </h5>
            {/* location type */}
            <h5>
                {userInformation.user_details_data.location_type}
            </h5>
            <ul>
                {userInformation.user_details_data.brgy_street_obj ? (
                    <>
                        <li>
                            Purok: {userInformation.user_details_data.brgy_street_obj.purok}
                        </li>
                        <li>
                            Streetname: {userInformation.user_details_data.brgy_street_obj.street_name}
                        </li>
                    </>
                ) : userInformation.user_details_data.village_obj ? (
                    <>
                        <li>
                            Village / Subdivision name: {/* {userInformation.user_details_data.village_obj.village_name} */}
                        </li>
                    </>
                ) : (
                    <li>Loading...</li>
                )}
                <li>
                    House no: {userInformation.user_details_data.house_number}
                </li>
            </ul>
            <button onClick={handleLogoutClick}>
                Logout
            </button>
        </ProtectedComponent>
    );
}

export default Sidebar;