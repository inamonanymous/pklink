import Swal from "sweetalert2";
import React, { useState } from "react";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";

function ManageHealthAssist() {
    const [healthInfoLoading, setHealthInfoLoading] = useState(false);
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allHealthSupportRequestsData, error, loading } = FetchData("/api/partial_admin/health_support_requests", refreshRequests);
    const [showHealthInfo, setShowHealthInfo] = useState(false);
    const [clickedHealthInfo, setClickedHealthInfo] = useState({});

    const handleDeleteHealth = async (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to continue deleting this request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
    
        if (!confirmDialogue.isConfirmed) {
            return;
        }
        try {
            const resp = await httpClient.delete('/api/partial_admin/health_support_requests', {
                params: { req_request_id: id }
            });
            setRefreshRequests((prev) => !prev);
            setShowHealthInfo(false);
            Swal.fire('Deleted!', 'The request has been deleted.', 'success')
        } catch (error) {
            console.error(error);
            let errorMsg = 'An error occurred while deleting the request.';
            if (error.response?.status === 403) errorMsg = 'Current user is not allowed.';
            if (error.response?.status === 404) errorMsg = 'Target request not found.';
            if (error.response?.status === 400) errorMsg = 'Invalid request.';
    
            Swal.fire('Error', errorMsg, 'error');
        }
    };

    const handleHealthInRowClick = async (e, health_id) => {
        e.preventDefault();
        setHealthInfoLoading(true);

        const clickedHealth = allHealthSupportRequestsData.find((health) => health.health_request_id === health_id);
        if (!clickedHealth) {
            console.error("Health support request not found");
            setHealthInfoLoading(false);
            return;
        }

        setClickedHealthInfo(clickedHealth);
        setHealthInfoLoading(false);
        setShowHealthInfo(true);
        setRefreshRequests((prev) => !prev); // Toggle state to refresh
    };

    return (
        <div id="manage-health-support-requests" className="flex manage-data">
            <div className="health-controls">
                <input type="text" placeholder="Search Health Support Requests" />
                
                <div className="table-con">
                    <table className="table table-bordered table-hover table-stripped">
                        <thead className="thead-darkr">
                            <tr>
                                <th scope="col">Request ID</th>
                                <th scope="col">Support Type</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allHealthSupportRequestsData === null || allHealthSupportRequestsData.length === 0 ? (
                                <>No health support requests</>
                            ) : (
                                allHealthSupportRequestsData.map((health) => (
                                    <tr 
                                        key={health.request_id}
                                        onClick={(e) => handleHealthInRowClick(e, health.health_request_id)}
                                    >
                                        <td>{health.request_id}</td>
                                        <td>{health.support_type}</td>
                                        <td>{health.status}</td>
                                        <td>{health.date_created}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="health-info">
                {!showHealthInfo ? (
                    <h3>Select Health Support Request</h3>
                ) : healthInfoLoading ? (
                    <h3>Loading...</h3>
                ) : (
                    <>
                        <h3>{clickedHealthInfo.support_type}</h3>
                        <h4>{clickedHealthInfo.description}</h4>
                        <h4>{clickedHealthInfo.status}</h4>
                        <h5>{clickedHealthInfo.date_created}</h5>
                        <button
                            onClick={handleDeleteHealth}
                            data-value={clickedHealthInfo.request_id}
                        >
                            Delete Request
                        </button>
                        <button>Edit Request</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageHealthAssist;
