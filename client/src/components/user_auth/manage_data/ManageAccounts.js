import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import no_profile from "../../../img/no_profile.png";
import Swal from "sweetalert2";

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
        // SweetAlert2 confirmation dialog
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this user from the verified list?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "Cancel",
        });

        if (confirmDialogue.isDismissed) return; // User canceled

        setLoading(true);
        try {
            console.log(id);
            const resp = await httpClient.delete('/api/partial_admin/verify', {
                    params: { req_user_id: id }
                });
            if (resp.status !== 201){
                Swal.fire("Failed!", "User could not be removed from verified list.", resp.message);
            }
            Swal.fire("Success!", "User removed from verified list!", resp.message);
            setIsVerifiedChecked(false);
            return;
        } catch (error) {
            if (error.status === 401){
                console.error(error);
                Swal.fire("Failed!", "Current user is not allowed", "error");
                return;
            }
            if (error.status === 404){
                console.error(error);
                Swal.fire("Failed!", "Target user is not found", "error");
                return;
            }
            if (error.status === 409){
                console.error(error);
                Swal.fire("Failed!", "Target user is listed as admin.", "error");
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
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this user from the verified list?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "Cancel",
        });
        console.log(confirmDialogue);
        if (confirmDialogue.isDismissed) return; // User canceled
        setLoading(true);
        try {
            const resp = await httpClient.put('/api/partial_admin/verify', {
                    "req_user_id": id
                });
            if (resp.status !== 201){
                return;
            }
            Swal.fire("Success", "User verified!", resp.message);
            setIsVerifiedChecked(true);
        } catch (error) {
            if (error.status !== 401){
                console.error(error);
                return;
            }
            Swal.fire("Failed!", "Unauthorized access!", "error");
        } finally {
            setLoading(false);
        }
    }
    
    //for handling every click in users list names
    const handleUserInListClick = async (e) => {
        e.preventDefault();
        // Remove focus class from all elements
        document.querySelectorAll('.focus').forEach(el => el.classList.remove('focus'));

        // Add focus class to the clicked element
        e.currentTarget.classList.add('focus');
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
        <div id="manage-accounts" className="flex manage-data">
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
                        placeholder="Search by name"
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
                                    <h5>{`${user.user_lastname}, ${user.user_firstname} ${user.user_middlename?.[0] ?? ''}.`}</h5>
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
                    <div className="head flex">
                        <div className="img-con">
                            {!individualUserInformation.user_photo_path ? (
                                <img src={no_profile} />
                            ) : (
                                <img 
                                    src={`https://storage.googleapis.com/pklink/${individualUserInformation.user_photo_path.replace(/\\/g, "/")}`} 
                                    alt={`${individualUserInformation.user_firstname} 
                                    ${individualUserInformation.user_lastname}'s profile`} 
                                />
                            )}
                            
                        </div>
                        <div className="text-con flex-col">
                            <h4>{`${individualUserInformation.user_firstname} ${individualUserInformation.user_middlename?.[0] ?? ''}${individualUserInformation.user_middlename ? '.' : ''} ${individualUserInformation.user_lastname}`}</h4>

                            <h6>{individualUserInformation.user_details_obj.email_address}</h6>
                        </div>
                    </div>
                        <div className="user-information">
                            <div className="basic-info flex-col">
                                <h4>Basic Information</h4>
                                <div className="flex text-con">
                                    <h6 className="label">Address</h6>
                                    <h6 className="value">
                                        {`${individualUserInformation.user_details_obj.brgy_street_obj.street_name}, 
                                        Purok ${individualUserInformation.user_details_obj.brgy_street_obj.purok}
                                        Puting Kahoy, Silang, Cavite
                                        `}
                                    </h6>
                                </div>

                                <div className="flex text-con">
                                    <h6 className="label">Civil status</h6>
                                    <h6 className="value">{individualUserInformation.user_details_obj.civil_status}</h6>
                                </div>

                                <div className="flex text-con">
                                    <h6 className="label">Contact number</h6>
                                    <h6 className="value">{individualUserInformation.user_details_obj.phone_number}</h6>
                                </div>

                                <div className="flex text-con">
                                    <h6 className="label">Date of birth</h6>
                                    <h6 className="value">
                                        {new Date(individualUserInformation.user_details_obj.birthday).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </h6>
                                </div>

                                <div className="flex text-con">
                                    <h6 className="label">Gender</h6>
                                    <h6 className="value">{individualUserInformation.user_gender}</h6>
                                </div>
                                
                            </div>

                            
                            <div className="button-con">
                                {!isVerifiedChecked && (
                                    <>
                                        <button  
                                            onClick={handleVerifyButton}
                                            data-value={individualUserInformation.user_id}
                                        >Verify</button>
                                        <button  
                                            /* onClick=/* {handleVerifyButton} */
                                            data-value={individualUserInformation.user_id}
                                        >Delete</button>
                                    </>
                                )}
                            </div>

                            <div className="button-con">
                                {isVerifiedChecked && (
                                    <button  
                                        onClick={handleRemoveFromVerified}
                                        data-value={individualUserInformation.user_id}
                                    >Remove</button>
                                    )}
                            </div>
                                
                                
                            </div>
                        
                    </>
                )}
            </div>  
        </div>
    );
}

export default ManageAccounts;