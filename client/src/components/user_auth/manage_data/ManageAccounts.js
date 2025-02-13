import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import no_profile from "../../../img/no_profile.png";

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
    console.log("all users: ", allUsers);
    //radio button checker fetching verified or not verified users
    const handleIsVerifiedChange = (event) => {
        setIsVerifiedChecked(event.target.checked);
        setShowUserDetails(false);
        setFilteredUsers(null);
    };

    //get data from allusers object by filtering names with search
    useEffect(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase();
      
        if (Array.isArray(allUsers) && trimmedQuery.length > 0) {
          // Split search query into individual words (space-separated)
          const searchWords = trimmedQuery.split(/\s+/); // Splits by any space(s)
      
          const filtered = allUsers.filter(user => {
            const fullName = `${user.user_firstname} ${user.user_middlename} ${user.user_lastname}`.toLowerCase();
      
            // Check if every search word is found somewhere in the full name
            return searchWords.every(word => fullName.includes(word));
          });
      
          setFilteredUsers(filtered);
        } else {
          // Reset the filtered users if the search query is empty
          setFilteredUsers(allUsers);
        }
      }, [searchQuery, allUsers]);
      

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
            const id = e.currentTarget.getAttribute('data-value');
            const resp = await httpClient.delete('/api/partial_admin/verify', {
                    params: { req_user_id: id }
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
            const data = {
                "req_user_username": e.currentTarget.getAttribute('data-value')
            }
            const resp = await httpClient.patch('/api/partial_admin/verify', data)
            setShowUserDetails(true);
            setIndividualUserInformation(resp.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false after the request finishes
        }
    }

   
    return (
        <div id="manage-accounts" className="flex">
            <div id="manage-accounts-search-list">
            
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={isVerifiedChecked}
                        onChange={handleIsVerifiedChange}
                        disabled={loading}
                    />
                    <span className="slider"></span>
                    <span className="account-status">
                        <h5>{isVerifiedChecked ? "Verified Accounts" : "Unverified Accounts"}</h5>
                    </span>
                </label>
                <div className="manage-accounts-list">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by username"
                        className="search-input"
                    />
                    <ul className="flex-col">
                        {/* check if there's items inside searched filtered users state */}
                        {filteredUsers !==null ? (
                            filteredUsers.map(user => (
                            <li key={user.user_id}>
                                <div
                                style={{ cursor: loading ? 'wait' : 'pointer' }}
                                onClick={handleUserInListClick}
                                data-value={user.user_username}
                                >
                                    <h5>{`${user.user_lastname}, ${user.user_firstname} ${user.user_middlename}`}</h5>
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
                                    <h6>{`${user.user_lastname}, ${user.user_firstname} ${user.user_middlename}`}</h6>
                                </div>
                            </li>
                            ))
                        ) : (
                            <li>No users found.</li>
                        )}
                    </ul>

                </div>
            
            </div>
            <div className="manage-individual-account flex-col">
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
                        <div className="img-con">
                            {!individualUserInformation.user_photo_path ? (
                                <img src={no_profile} />
                            ) : (
                                <img 
                                    src={`https://storage.googleapis.com/pklink/${individualUserInformation.user_photo_path.replace(/\\/g, "/")}`} 
                                    alt={`${individualUserInformation.user_firstname} ${individualUserInformation.user_lastname}'s profile`} 
                                />
                            )}
                            
                        </div>
                        <div className="user-information flex">
                            <div className="basic-info">
                                <h4>Basic info</h4>
                                <h6> {/* users' name */}
                                    {individualUserInformation.user_lastname}, &nbsp;
                                    {individualUserInformation.user_firstname} &nbsp;
                                    {individualUserInformation.user_middlename} &nbsp;
                                    {individualUserInformation.user_suffix
                                }</h6>
                                <h6>{individualUserInformation.user_gender}</h6>
                                <h6>{individualUserInformation.user_date_created}</h6>

                                {/* /* if fetch method is unverified users */}
                                {isVerifiedChecked ? (
                                    <>
                                        <h6>Verified</h6>
                                    </>
                                ) : (
                                    <>
                                        <h6>Unverified</h6>
                                        <button  
                                            onClick={handleVerifyButton}
                                            data-value={individualUserInformation.user_id}
                                        >Verify</button>
                                    </>
                                    )}
                            </div>

                            <div className="contact-info">
                                <h4>Contact Info</h4>
                                <h6>{individualUserInformation.user_details_obj.email_address}</h6>
                                <h6>{individualUserInformation.user_details_obj.phone_number}</h6>
                                <h6>{individualUserInformation.user_details_obj.phone_number2}</h6>                            
                            </div>
                            <div className="contact-info">
                                <h4>Address info</h4>
                                <h6>Location Type: {individualUserInformation.user_details_obj.location_type}</h6>
                                <h6>House Number: {individualUserInformation.user_details_obj.house_number}</h6>
                                {/* if location is village type */}
                                {individualUserInformation.user_details_obj.village_obj ? (
                                    <>
                                        <h6>Block: {individualUserInformation.user_details_obj.block_number}</h6>
                                        <h6>Lot: {individualUserInformation.user_details_obj.lot_number}</h6>
                                        <h6>Village street: {individualUserInformation.user_details_obj.village_street}</h6>
                                    
                                    </>
                                ) : (
                                    <>
                                        {/* if location is local type */}
                                        <h6>Purok: {individualUserInformation.user_details_obj.brgy_street_obj.purok}</h6>
                                        <h6>Street: {individualUserInformation.user_details_obj.brgy_street_obj.street_name}</h6>
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
                                        data-value={individualUserInformation.user_id}
                                    >Remove</button>
                                    )}
                            </div>
                                
                                
                            </div>
                        </div>
                    </>
                )}
            </div>  
        </div>
    );
}

export default ManageAccounts;