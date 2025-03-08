import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import no_profile from "../../../img/no_profile.png";
import Swal from "sweetalert2";

import Slider from "react-slick";

function ManageAccounts({privileges}) {
    const [loading, setLoading] = useState(false);//for loading effects
    const [allUsers, setAllUsers] = useState(null); //object state for all users 
    const [individualUserInformation, setIndividualUserInformation] = useState(null); //object state for all individual users information
    const [isVerifiedChecked, setIsVerifiedChecked] = useState(true); //boolean state for radio button fetch check
    const [showUserDetails, setShowUserDetails] = useState(false); //boolean state for showing user details
    
    const [searchQuery, setSearchQuery] = useState(''); // string state for search bar query
    const [filteredUsers, setFilteredUsers] = useState(null);// object state for filtered user information regarding from search query

    const [isAdmin, setIsAdmin] = useState(false);

    //get all users from api
    useEffect(() => {
        setIsAdmin(privileges.admin)
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
    /* console.log("all users: ", allUsers); */
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
      

      const handleAssignResidentType = (e) => {
        e.preventDefault();
        const userId = e.currentTarget.getAttribute('data-value'); // Get user ID from button data-value
    
    
        try {
            document.body.style.cursor = 'wait';
            // First Swal - Ask the user to confirm Assign/Delete or Cancel
            Swal.fire({
                title: 'Do you want to assign or delete a Resident Type?',
                showCancelButton: true,
                confirmButtonText: 'Assign',
                cancelButtonText: 'Cancel',
                showDenyButton: true,
                denyButtonText: 'Delete',
                icon: 'question',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // If user clicks Assign, we need to get the resident types and show the dropdown
                    try {
                        // Fetch resident types
                        document.body.style.cursor = 'wait';
                        const resp = await httpClient.get('/api/admin/residenttype');
                        if (resp.status !== 200) {
                            Swal.fire('Error!', 'Failed to load resident types', 'error');
                            return;
                        }
    
                        // Extract resident type names and IDs for the dropdown
                        const residentTypes = resp.data;
                        const dropdownOptions = residentTypes.map(type => ({
                            text: type.resident_type_name,
                            value: type.resident_type_id
                        }));
    
                        // Second Swal - Show dropdown for resident type selection
                        const { value: selectedResidentType } = await Swal.fire({
                            title: 'Select a Resident Type',
                            input: 'select',
                            inputOptions: dropdownOptions.reduce((options, type) => {
                                options[type.value] = type.text;
                                return options;
                            }, {}),
                            inputPlaceholder: 'Select Resident Type',
                            showCancelButton: true,
                            confirmButtonText: 'Submit',
                            cancelButtonText: 'Cancel',
                            inputValidator: (value) => {
                                if (!value) {
                                    return 'You need to select a resident type!';
                                }
                            }
                        });
    
                        // If the user selects a resident type
                        if (selectedResidentType) {
                            // Assign the resident type to the user
                            try {
                                document.body.style.cursor = 'wait';
                                const assignResp = await httpClient.put('/api/admin/manage_users', {
                                    req_user_id: userId,
                                    req_resident_type_id: selectedResidentType,
                                    req_alter_type: "assign",  // Add assign operation
                                });
        
                                if (assignResp.status === 200) {
                                    Swal.fire('Success!', 'Resident type assigned successfully', 'success');
                                } else {
                                    Swal.fire('Error!', 'Failed to assign resident type', 'error');
                                }
                            } catch (error) {
                                Swal.fire('Error!', 'Failed to assign resident type', 'error');
                            }
                        }
                    } catch (error) {
                        Swal.fire('Error!', 'Something went wrong while fetching the data', 'error');
                    } finally {
                        document.body.style.cursor = 'default';
                    }
                } else if (result.isDenied) {
                    // If the user clicks Delete, confirm with another popup
                    Swal.fire({
                        title: 'Are you sure you want to delete this Resident Type?',
                        text: "This will remove the resident type from the user.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'No, cancel!',
                    }).then(async (deleteResult) => {
                        if (deleteResult.isConfirmed) {
                            // Proceed to delete the resident type from the user
                            try {
                                const deleteResp = await httpClient.put('/api/admin/manage_users', {
                                    req_user_id: userId,
                                    req_resident_type_id: '',  // No resident type ID for delete
                                    req_alter_type: "delete",  // Add delete operation
                                });
        
                                if (deleteResp.status === 200) {
                                    Swal.fire('Deleted!', 'Resident type has been deleted successfully.', 'success');
                                } else {
                                    Swal.fire('Error!', 'Failed to delete resident type', 'error');
                                }
                                
                            } catch (error) {
                                Swal.fire('Error!', 'Failed to delete resident type', 'error');
                            } finally {
                                document.body.style.cursor = 'default';
                            }
                        }
                    });
                }
            });
        } catch (error) {
            Swal.fire('Error!', 'An unexpected error occurred', 'error');
        } finally {
            // Reset the cursor once the process is complete
            document.body.style.cursor = 'default';
        }
    };
    

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
            document.body.style.cursor = 'wait';
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
            document.body.style.cursor = 'default';
            setLoading(false);
        }
    }

    const handleDeleteButton = async (e) => {
        e.preventDefault()
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });
        if (confirmDialogue.isDismissed) return; // User canceled
        setLoading(true);
        try {
            document.body.style.cursor = 'wait';
            const resp = await httpClient.delete('/api/admin/manage_users', {
                params: { req_user_id: id }
            })
            if (resp.status !== 200){
                return;
            }
            Swal.fire("Success", "User deleted!", resp.message);
            setIsVerifiedChecked(true);
        } catch (error) {
            if (error.status !== 401){
                console.error(error);
                return;
            }
            Swal.fire("Failed!", "Unauthorized access!", "error");
        } finally {
            document.body.style.cursor = 'default';
            setLoading(false);
        }
    }

    //for handing verify button for pending unverified users
    const handleVerifyButton = async (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
            title: "Are you sure?",
            text: "You want to add this user from the verified list?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, verify it!",
            cancelButtonText: "Cancel",
        });
        if (confirmDialogue.isDismissed) return; // User canceled
        setLoading(true);
        try {
            document.body.style.cursor = 'wait';
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
            document.body.style.cursor = 'default';
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
            document.body.style.cursor = 'wait';
            const data = {
                "req_user_username": e.currentTarget.getAttribute('data-value')
            }
            const resp = await httpClient.patch('/api/partial_admin/verify', data)
            setShowUserDetails(true);
            setIndividualUserInformation(resp.data);
        } catch (error) {
            console.error(error);
        } finally {
            document.body.style.cursor = 'default';
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
                            <p className="alt-2">{individualUserInformation.user_resident_type}</p>
                        </div>
                    </div>
                        <div className="user-information">
                             <Slider
                                dots={true}
                                infinite={true}
                                speed={300}
                                slidesToShow={1}
                                slidesToScroll={1}
                                arrows={true}
                                autoplay={true}
                            >
                                <div className="basic-info flex-col">
                                    <h4>Basic Information</h4>
                                    <div className="flex text-con">
                                        <h6 className="label">Address</h6>
                                        <h6 className="value">
                                            {individualUserInformation.user_details_obj.brgy_street_obj ? (
                                                //if user is from local brgy
                                                `${individualUserInformation.user_details_obj.brgy_street_obj.street_name} Street, 
                                                Purok ${individualUserInformation.user_details_obj.brgy_street_obj.purok}, 
                                                Puting Kahoy, Silang, Cavite`
                                            ) : (
                                                //if user is from village or subdivision under puting kahoy brgy
                                                `${individualUserInformation.user_details_obj.village_obj.village_name}, 
                                                ${individualUserInformation.village_street} Street, 
                                                Block no. ${individualUserInformation.user_details_obj.block_number},
                                                Lot no. ${individualUserInformation.user_details_obj.lot_number}
                                                `
                                            )}
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

                                <div className="user-file-submissions">
                                    <h4>User File Submissions</h4>
                                    <div className="flex">
                                        <div className="img-con flex-col">
                                            <p>Government ID</p>
                                            <a 
                                                href={`https://storage.googleapis.com/pklink/uploads/users/user_${individualUserInformation.user_id}/gov_id.jpg`}
                                                target="_blank"
                                            >    
                                                <img 
                                                    src={`https://storage.googleapis.com/pklink/uploads/users/user_${individualUserInformation.user_id}/gov_id.jpg`}
                                                    alt="government id"
                                                />
                                            </a>
                                        </div>
                                        <div className="img-con flex-col">
                                            <p>Selfie Picture</p>
                                            <a 
                                                href={`https://storage.googleapis.com/pklink/uploads/users/user_${individualUserInformation.user_id}/selfie.jpg`}
                                                target="_blank"
                                            >
                                                <img 
                                                    src={`https://storage.googleapis.com/pklink/uploads/users/user_${individualUserInformation.user_id}/selfie.jpg` }
                                                    alt="government id"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Slider>

                            
                            <div className="button-con controls">
                                {!isVerifiedChecked && (
                                    <>
                                        <button  
                                            onClick={handleVerifyButton}
                                            data-value={individualUserInformation.user_id}
                                        >Verify</button>
                                        <button  
                                            onClick={handleDeleteButton} 
                                            data-value={individualUserInformation.user_id}
                                        >Delete</button>
                                    </>
                                )}
                            </div>

                            <div className="button-con controls">
                                {isVerifiedChecked && (
                                    <>
                                    <button  
                                        onClick={handleRemoveFromVerified}
                                        data-value={individualUserInformation.user_id}
                                        > Remove
                                    </button>
                                    {isAdmin && (
                                        <button
                                            data-value={individualUserInformation.user_id}
                                            onClick={handleAssignResidentType}
                                        >Assign Resident Type
                                        </button>
                                    )}
                                    </>
                                    
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