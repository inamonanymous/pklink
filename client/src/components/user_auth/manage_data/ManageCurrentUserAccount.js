import { useState } from "react";
import Swal from "sweetalert2";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";

function ManageCurrentUserAccount() {
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to refresh data after updates
    const { data, error, loading } = FetchData("/api/user/auth", refreshTrigger);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data</p>;
    if (!data || !data.res_user_data) return <p>No user data found</p>;

    const user_data = data.res_user_data;
    const user_details_data = data.res_user_details_data;
    const timestamp = Date.now();

    const handlePhotoUpdate = async (alterType) => {
        if (alterType === "delete") {
            // Confirm before deleting
            const confirmDelete = await Swal.fire({
                title: "Are you sure?",
                text: "Your profile photo will be permanently removed.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            });
    
            if (!confirmDelete.isConfirmed) return;
        }
    
        // If deleting, send the request immediately
        if (alterType === "delete") {
            try {
                document.body.style.cursor = "wait";
                const formData = new FormData();
                formData.append("req_alter_type", alterType);
                formData.append("req_user_id", user_data.user_id);
    
                const response = await httpClient.patch("/api/user/auth", formData);
                Swal.fire("Success!", response.data.message, "success");
                setRefreshTrigger((prev) => prev + 1); // Refresh UI
            } catch (error) {
                Swal.fire("Error!", error.response?.data?.message || "Failed to delete photo", "error");
            } finally {
                document.body.style.cursor = "default";
            }
            return;
        }
    
        // Handle file selection for uploading a new photo
        const { value: file } = await Swal.fire({
            title: "Select a Photo to Upload",
            input: "file",
            inputAttributes: { accept: "image/*", "aria-label": "Upload your profile picture" },
            showCancelButton: true,
            confirmButtonText: "Upload",
            cancelButtonText: "Cancel",
            preConfirm: async (file) => {
                if (!file) {
                    Swal.showValidationMessage("Please select a photo to upload");
                    return false;
                }
    
                const formData = new FormData();
                formData.append("req_user_photo_path", file);
                formData.append("req_alter_type", alterType);
                formData.append("req_user_id", user_data.user_id);
    
                try {
                    document.body.style.cursor = "wait";
                    const response = await httpClient.patch("/api/user/auth", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
    
                    Swal.fire("Success!", response.data.message, "success");
                    setRefreshTrigger((prev) => prev + 1); // Refresh UI
                } catch (error) {
                    Swal.fire("Error!", error.response?.data?.message || "Failed to upload photo", "error");
                } finally {
                    document.body.style.cursor = "default";
                }
            },
        });
    
        if (!file) return;
    };    
    
    
    const handleManagePhoto = async () => {
        const { value: action } = await Swal.fire({
            title: "Manage Profile Photo",
            text: "Choose an action:",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Upload New Photo",
            denyButtonText: "Delete Current Photo",
            cancelButtonText: "Cancel",
        });
    
        if (action) {
            handlePhotoUpdate("edit"); // Upload a new photo
        } else if (action === false) {
            handlePhotoUpdate("delete"); // Delete the photo
        }
    };
    
    return (
        <div id="manage-current-user-account">
            <div className="flex">
                <div className="left-container flex-col">
                    <div className="img-con">
                        {!user_data.user_photo_path ? (
                            <>
                                <img
                                    src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
                                    alt={`${user_data.user_firstname} ${user_data.user_lastname}'s profile`}
                                />
                                <span className="photo-overlay" onClick={() => handlePhotoUpdate("add")}>Add Photo</span>
                            </>
                        ) : (
                            <>
                                <img
                                    src={`https://storage.googleapis.com/pklink/${user_data.user_photo_path.replace(/\\/g, "/")}?${timestamp}`}
                                    alt={`${user_data.user_firstname} ${user_data.user_lastname}'s profile`}
                                />
                                <span className="photo-overlay" onClick={() => handleManagePhoto("edit")}>Edit Photo</span>
                            </>
                        )}
                    </div>

                    <div className="text-con">
                        <h4>{`${user_data.user_firstname} ${user_data.user_middlename?.[0] ?? ''}${user_data.user_middlename ? '.' : ''} ${user_data.user_lastname}`}</h4>
                        <h6>{user_details_data.email_address}</h6>
                    </div>
                </div>

                <div className="right-container">
                    <div className="personal-information flex-col data-container">
                        <div className="text-con flex head">
                            <h5 className="label">PERSONAL INFORMATION</h5>
                            <a href="#">Edit</a>
                        </div>
                        <div className="text-con flex">
                            <h5 className="label">Address</h5>
                            <h5 className="value">
                                {user_details_data.brgy_street_obj ? (
                                    //if user is from local brgy
                                    `${user_details_data.brgy_street_obj.street_name} Street, 
                                    Purok ${user_details_data.brgy_street_obj.purok}, 
                                    Puting Kahoy, Silang, Cavite`
                                ) : (
                                    //if user is from village or subdivision under puting kahoy brgy
                                    `${user_details_data.village_obj.village_name}, 
                                    ${user_details_data.village_street} Street, 
                                    Block no. ${user_details_data.block_number},
                                    Lot no. ${user_details_data.lot_number}
                                    `
                                )}

                            </h5>
                        </div>

                        <div className="flex text-con">
                            <h5 className="label">Civil status</h5>
                            <h5 className="value">{user_details_data.civil_status}</h5>
                        </div>

                        <div className="flex text-con">
                            <h5 className="label">Contact number</h5>
                            <h5 className="value">{user_details_data.phone_number}</h5>
                        </div>

                        <div className="flex text-con">
                            <h5 className="label">Date of birth</h5>
                            <h5 className="value">
                                {new Date(user_details_data.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </h5>
                        </div>

                        <div className="flex text-con">
                            <h5 className="label">Gender</h5>
                            <h5 className="value">{user_data.user_gender}</h5>
                        </div>
                    </div>

                    <div className="user-file-submissions flex">
                        <div className="img-con flex-col">
                            <p>Government ID</p>
                            <a 
                                href={`https://storage.googleapis.com/pklink/uploads/users/user_${user_data.user_id}/gov_id.jpg`}
                                target="_blank"
                            >    
                                <img 
                                    src={`https://storage.googleapis.com/pklink/uploads/users/user_${user_data.user_id}/gov_id.jpg`}
                                    alt="government id"
                                />
                            </a>
                        </div>
                        <div className="img-con flex-col">
                            <p>Selfie Picture</p>
                            <a 
                                href={`https://storage.googleapis.com/pklink/uploads/users/user_${user_data.user_id}/selfie.jpg`}
                                target="_blank"
                            >
                                <img 
                                    src={`https://storage.googleapis.com/pklink/uploads/users/user_${user_data.user_id}/selfie.jpg` }
                                    alt="government id"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageCurrentUserAccount;
