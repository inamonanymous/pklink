import { ReactComponent as PkLogo } from '../../img/pk_logo.svg';
import { ReactComponent as AnnouncementLogo } from '../../img/announcement_logo.svg';
import { ReactComponent as CalendarLogo } from '../../img/calendar_logo.svg';
import { ReactComponent as DocRequestLogo } from '../../img/docrequest_logo.svg';
import { ReactComponent as HealthLogo } from '../../img/healthrequest_logo.svg';
import { ReactComponent as ReportLogo } from '../../img/report_logo.svg';
import { ReactComponent as FormsLogo } from '../../img/forms_logo.svg';
import { ReactComponent as MenuLogo } from '../../img/menu_logo.svg';
import { ReactComponent as NotifLogo } from '../../img/notif_logo.svg';
import { ReactComponent as UserLogo } from '../../img/user_logo.svg';
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate  } from 'react-router-dom';
import httpClient from '../../httpClient';

function Header({ priveleges }) {
    //route navigator
    const navigate = useNavigate()
    //user dropdown toggle
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    // Toggle dropdown visibility
    const userDropdownToggle = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };
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


    //user logout on click
    const handleLogoutClick = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        
        if (confirmed) {
            logoutUser(); // Log out the user
            navigate('/'); // Redirect to the home page or any other page
        }
    };
    
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

    return (
        <header id="header-ua" className='user-auth'>
            <div>
                <div className="img-con logo">
                    <a href="#">
                        <PkLogo />
                    </a>
                </div>
                <nav className='content-nav'>
                    <ul className='flex'>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <AnnouncementLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <CalendarLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <DocRequestLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <HealthLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <ReportLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <FormsLogo />
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>
                <nav className='user-nav'>
                    <ul className='flex'>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <MenuLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <NotifLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con'>
                                <a href="#" onClick={userDropdownToggle}>
                                    <UserLogo />
                                </a>
                            </div>
                            {isUserDropdownOpen && (
                                <div className="user-dropdown">
                                    <p>Welcome, User!</p>
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

                                    <h5>
                                        {priveleges.type_name}
                                    </h5>
                                    <button onClick={handleLogoutClick}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
