function ManageCurrentUserAccount(userInformation) {
    const user_data = userInformation.userInformation.user_data 
    const user_details_data = userInformation.userInformation.user_details_data
    console.log(user_data)
    console.log(user_details_data)
    return(
        <div id="manage-current-user-account">
            <div className="flex">
                <div className="left-container flex-col">
                    <div className="img-con">
                        {!user_data.user_photo_path ? (
                            <img 
                                src={`https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1`} 
                                alt={`${user_data.user_firstname} 
                                ${user_data.user_lastname}'s profile`} 
                            />
                        ) : (
                            <img 
                                src={`https://storage.googleapis.com/pklink/${user_data.user_photo_path.replace(/\\/g, "/")}`} 
                                alt={`${user_data.user_firstname} 
                                ${user_data.user_lastname}'s profile`} 
                            />
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
                                {`${user_details_data.brgy_street_obj.street_name}, 
                                    Purok ${user_details_data.brgy_street_obj.purok}
                                    Puting Kahoy, Silang, Cavite
                                `}
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
                                {new Date(user_details_data.birthday).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </h5>
                        </div>

                        <div className="flex text-con">
                            <h5 className="label">Gender</h5>
                            <h5 className="value">{user_data.user_gender}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageCurrentUserAccount;