import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import ProtectedComponent from "../ProtectedComponent";

function ManageAccounts() {
    const [loading, setLoading] = useState(false);//for loading effects
    const [allUsers, setAllUsers] = useState(null); //object state for all users 
    const [individualUserInformation, setIndividualUserInformation] = useState(null); //object state for all individual users information
    const [isVerifiedChecked, setIsVerifiedChecked] = useState(true); //boolean state for radio button fetch check
    const [showUserDetails, setShowUserDetails] = useState(false); //boolean state for showing user details
    
    const [searchQuery, setSearchQuery] = useState(''); // string state for search bar query
    const [filteredUsers, setFilteredUsers] = useState(null);// object state for filtered user information regarding from search query

    //get all users from api
    useEffect(() => {
        const fetchUserData = async() => {
            setLoading(true);
            try {
                let resp = null;
                if (!isVerifiedChecked) {
                    resp = await httpClient.get('/api/partial_admin/unverified_users');     
                    if (resp.status !== 200) {                    
                        return;
                    }
                    setAllUsers(resp.data);
                    setSearchQuery('');
                    return;
                }
                resp = await httpClient.get('/api/partial_admin/verify');
                 if (resp.status !== 200) {                    
                    return;
                }
                setAllUsers(resp.data);
                setSearchQuery('');
                return;
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [isVerifiedChecked]);
    
    //radio button checker fetching verified or not verified users
    const handleIsVerifiedChange = (event) => {
        setIsVerifiedChecked(event.target.checked);
        setShowUserDetails(false);
        setFilteredUsers(null);
    };

    //get data from allusers object by filtering names with search
    useEffect(() => {
        if (Array.isArray(allUsers)) {
          const filtered = allUsers.filter(user =>
            user.user_lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.user_middlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.user_firstname.toLowerCase().includes(searchQuery.toLowerCase())
          );

          setFilteredUsers(filtered);
        }
      }, [searchQuery]);

    // Handle input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    //for handling remove button for removing a user in verified list
    const handleRemoveFromVerified = async (e) => {
        e.preventDefault();
        const confirmDialogue = window.confirm("You want to remove this user from verified list?");
        if (!confirmDialogue){
            return;
        }
        setLoading(true);
        try {
            const username = e.currentTarget.getAttribute('data-value');
            const resp = await httpClient.delete('/api/partial_admin/verify', {
                    params: { req_user_username: username }
                });
            if (resp.status !== 201){
                return;
            }
            alert('user deleted');
            setIsVerifiedChecked(false);
            return;
        } catch (error) {
            if (error.status === 401){
                console.error(error);
                alert('current user is not allowed');
                return;
            }
            if (error.status === 404){
                console.error(error);
                alert('target user is not found');
                return;
            }
            if (error.status === 409){
                console.error(error);
                alert('target user is listed as admin');
                return;
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    //for handing verify button for pending unverified users
    const handleVerifyButton = async (e) => {
        e.preventDefault();
        const confirmDialogue = window.confirm("You want to verify this user?");
        if (!confirmDialogue){
            return;
        }
        setLoading(true);
        try {
            const resp = await httpClient.put('/api/partial_admin/verify', {
                    "req_user_username": e.currentTarget.getAttribute('data-value')
                });
            if (resp.status !== 201){
                return;
            }
            alert('user verified');
            setIsVerifiedChecked(true);
        } catch (error) {
            if (error.status !== 401){
                console.error(error);
                return;
            }
            alert("Unauthorized access");
        } finally {
            setLoading(false);
        }
    }
    
    //for handling every click in users list names
    const handleUserInListClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await httpClient.patch('/api/partial_admin/verify', {
                "req_user_username": e.currentTarget.getAttribute('data-value')
            })
            setShowUserDetails(true);
            setIndividualUserInformation(resp.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false after the request finishes
        }
    }

   
    return (
        <>
        
            <label>
                <input
                type="checkbox"
                checked={isVerifiedChecked}
                onChange={handleIsVerifiedChange}
                style={{ cursor: loading ? 'wait' : 'default' }}
                />
                <span>{isVerifiedChecked ? 'Verified' : 'Unverified'}</span>
            </label>
            <div className="manage-accounts-list">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by username"
                />
                <ul>
                    {/* check if there's items inside searched filtered users state */}
                    {filteredUsers !==null ? (
                        filteredUsers.map(user => (
                        <li key={user.user_id}>
                            <div
                            style={{ cursor: loading ? 'wait' : 'pointer' }}
                            onClick={handleUserInListClick}
                            data-value={user.user_username}
                            >
                            <dt>{`${user.user_lastname}, ${user.user_firstname} ${user.user_middlename}`}</dt>
                            </div>
                        </li>
                        ))
                    /* check if there's items inside all users state */
                    ) : allUsers ? (
                        allUsers.map(user => (
                        <li key={user.user_id}>
                            <div
                            style={{ cursor: loading ? 'wait' : 'pointer' }}
                            onClick={handleUserInListClick}
                            data-value={user.user_username}
                            >
                            <dt>{`${user.user_lastname}, ${user.user_firstname} ${user.user_middlename}`}</dt>
                            </div>
                        </li>
                        ))
                    ) : (
                        <li>No users found.</li>
                    )}
                </ul>

            </div>
            <div className="manage-individual-account">
                {!showUserDetails ? (
                    <>
                        Select User
                    </>
                ) : loading ? (
                    <>
                        Loading
                    </>
                ) : (
                    <>
                        <div className="basic-info">
                            <h6>Basic info</h6>
                            <p> {/* users' name */}
                                {individualUserInformation.user_lastname}, &nbsp;
                                {individualUserInformation.user_firstname} &nbsp;
                                {individualUserInformation.user_middlename} &nbsp;
                                {individualUserInformation.user_suffix
                            }</p>
                            <p>{individualUserInformation.user_gender}</p>
                            <p>{individualUserInformation.user_date_created}</p>

                            {/* /* if fetch method is unverified users */}
                            {isVerifiedChecked ? (
                                <>
                                    Verified
                                </>
                            ) : (
                                <button  
                                    onClick={handleVerifyButton}
                                    data-value={individualUserInformation.user_username}
                                >Verify</button>
                                )}
                        </div>

                        <div className="contact-info">
                            <h6>Contact info</h6>
                            <p>{individualUserInformation.user_details_obj.email_address}</p>
                            <p>{individualUserInformation.user_details_obj.phone_number}</p>
                            <p>{individualUserInformation.user_details_obj.phone_number2}</p>                            
                        </div>
                        <div className="contact-info">
                            <h6>Address info</h6>
                            <p>Location Type: {individualUserInformation.user_details_obj.location_type}</p>
                            <p>House Number: {individualUserInformation.user_details_obj.house_number}</p>
                            {/* if location is village type */}
                            {individualUserInformation.user_details_obj.village_obj ? (
                                <>
                                    <p>Block: {individualUserInformation.user_details_obj.block_number}</p>
                                    <p>Lot: {individualUserInformation.user_details_obj.lot_number}</p>
                                    <p>Village street: {individualUserInformation.user_details_obj.village_street}</p>
                                
                                </>
                            ) : (
                                <>
                                    {/* if location is local type */}
                                    <p>Purok: {individualUserInformation.user_details_obj.brgy_street_obj.purok}</p>
                                    <p>Street: {individualUserInformation.user_details_obj.brgy_street_obj.street_name}</p>
                                </>
                            )}
                            
                        <div className="button-con">
                            {!isVerifiedChecked ? (
                                <>
                                    Pending status
                                </>
                            ) : (
                                <button  
                                    onClick={handleRemoveFromVerified}
                                    data-value={individualUserInformation.user_username}
                                >Remove</button>
                                )}
                        </div>
                            
                            
                        </div>
                    </>
                )}
            </div>
           
        </>
    );
}

export default ManageAccounts;