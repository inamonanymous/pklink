import Swal from 'sweetalert2';
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
import { ReactComponent as InformationLogo } from '../../img/information_logo.svg';
import { ReactComponent as SettingsLogo } from '../../img/settings_logo.svg';
import { ReactComponent as LogoutLogo } from '../../img/logout_logo.svg';
import  no_profile from '../../img/no_profile.png';
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate  } from 'react-router-dom';
import httpClient from '../../httpClient';

const privilegedItems = [
    { name: 'Manage Accounts', view: 'manage_accounts', privilege: 'view_accounts', icon: 'bi-person-lines-fill' },
    { name: 'Manage Events', view: 'manage_events', privilege: 'manage_event', icon: 'bi-calendar-event' },
    { name: 'Manage Posts', view: 'manage_posts', privilege: 'manage_post', icon: 'bi-pencil-square' },
    { name: 'Manage Document Requests', view: 'manage_document_req', privilege: 'manage_request', icon: 'bi-file-earmark-text' },
    { name: 'Manage Health Assistance Requests', view: 'manage_health', privilege: 'manage_request', icon: 'bi-heart-pulse' },
    { name: 'Manage Report Incidents', view: 'manage_incidents', privilege: 'partial_admin', icon: 'bi-exclamation-triangle' },
    { name: 'Manage Streets and Villages', view: 'manage_streets_villages', privilege: 'partial_admin', icon: 'bi bi-geo-alt' },
    { name: 'Manage Resident Type', view: 'manage_resident_type', privilege: 'admin', icon: 'bi bi-person-check' },
];

function Header({ onViewChange, priveleges, activeView }) {
    const navItems = [
        { view: 'posts', logo: <AnnouncementLogo />, name: 'Community Updates' },
        { view: 'events', logo: <CalendarLogo />, name: 'Events' },
        { view: 'document', logo: <DocRequestLogo />, name: 'Documents' },
        { view: 'health', logo: <HealthLogo />, name: 'Health' },
        { view: 'report', logo: <ReportLogo />, name: 'Reports' },
        /* { view: 'forms', logo: <FormsLogo />, name: 'Forms' }, */
      ];
      
    //route navigator
    const navigate = useNavigate()
    //user dropdown toggle
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    // Toggle dropdown visibility
    const menuDropdownToggle = () => {
        setIsMenuDropdownOpen(!isMenuDropdownOpen);
    };

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

    // user logout
    const logoutUser = useCallback(async () => {
        try {
            const resp = await httpClient.delete('/api/user/auth');
            Swal.fire('Success!', 'Logged out successfully', 'success');
        } catch (e) {
            console.error('Logout error: ', e);
        }
    }, []);

    // user logout on click
    const handleLogoutClick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to log out?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log me out!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser(); // Log out the user
                navigate('/'); // Redirect to the home page or any other page
            }
        });
    };

    
    //set user details from endpoint
    useEffect(() => {
        const getUserInformation = async () => {
            try { 
                const resp = await httpClient.get('/api/user/auth');
                
                if (resp.status !== 200) {
                    Swal.fire('Error!', 'Error getting user information', 'error');
                }
                setUserInformation({
                'user_data': resp.data.res_user_data, 
                'user_details_data': resp.data.res_user_details_data,
                });
                console.log(userInformation)
            } catch (error) {
                if (error.response.status===401){
                    Swal.fire('Failed!', 'Session not found', 'failed');
                    return;
                }
                Swal.fire('Error!', 'Internal server errror', 'error');
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
                        {navItems.map((item, index) => (
                            <li key={item.view}>
                            <div className={`img-con ${activeView === item.view ? 'focused' : ''}`}>
                                <a
                                href="#"
                                onClick={() => onViewChange(item.view, index)}
                                >
                                {item.logo}
                                </a>
                            </div>
                            </li>
                        ))}
                    </ul>
                </nav>
                <nav className='user-nav'>
                    <ul className='flex logos'>
                        {priveleges.partial_admin && (
                            <li>
                                    <div className='img-con'>
                                        <a href="#" onClick={menuDropdownToggle}>
                                            <MenuLogo />
                                        </a>
                                    </div>
                                
                                {isMenuDropdownOpen && (
                                    <div className='menu-dropdown flex-col'>
                                            {privilegedItems.map((item) => (
                                                priveleges?.[item.privilege] && (
                                                    <div key={item.view} className="menu-item" onClick={() => {
                                                        menuDropdownToggle();
                                                        onViewChange(item.view);
                                                    }}>
                                                        <div className="icon">
                                                            <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', marginRight: '10px' }}></i>
                                                        </div>
                                                        <span>{item.name}</span>
                                                    </div>
                                                )
                                            ))}
                                    </div>
                                )}
                            </li>
                        )}
                        <li>
                            <div className='img-con'>
                                <a href="#">
                                    <NotifLogo />
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className='img-con user-avatar'>
                                <a href="#" onClick={userDropdownToggle}>
                                    {!userInformation.user_data.user_photo_path ? (
                                        <UserLogo />
                                    ) : (
                                        <img 
                                        src={`https://storage.googleapis.com/pklink/${userInformation.user_data.user_photo_path.replace(/\\/g, "/")}`}

                                            alt={`${userInformation.user_data.user_lastname}, ${userInformation.user_data.user_firstname} ${userInformation.user_data.user_middlename}'s profile`} 
                                        />
                                    )}
                                </a>
                            </div>
                            {isUserDropdownOpen && (
                                <div className="user-dropdown flex-col">
                                    <div className='img-con user-profile-photo flex'>
                                        {!userInformation.user_data.user_photo_path ? (
                                            <img
                                                src={no_profile}
                                            />
                                        ) : (
                                            <img 
                                            src={`https://storage.googleapis.com/pklink/${userInformation.user_data.user_photo_path.replace(/\\/g, "/")}`}
                                                alt={`${userInformation.user_data.user_lastname}, ${userInformation.user_data.user_firstname} ${userInformation.user_data.user_middlename}'s profile`} 
                                            />
                                        )}
                                        
                                    </div>
                                    <div className='text-con'>                 
                                        <h4 className='user-fullname'> {/* users's name */}
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
                                            
                                        <h6 className='user-location-type'> {/* Location Type */}
                                            {userInformation.user_details_data.location_type}
                                        </h6>

                                        <p className='user-privilege-type'>
                                            {priveleges.type_name}
                                        </p>
                                    </div>
                                    <div className='control-buttons-con flex-col'>
                                        <a 
                                            href="#"
                                            className='button'
                                            onClick={() => onViewChange('manage_my_account', userInformation)}
                                        >
                                            <InformationLogo />
                                            View Profile
                                        </a>
                                        <a href="#" className='button'>
                                            <SettingsLogo />
                                            Settings
                                        </a>
                                        <a href="#" className='button logout-button' onClick={handleLogoutClick}>
                                            <LogoutLogo />
                                            Logout
                                        </a>
                                    </div>
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
