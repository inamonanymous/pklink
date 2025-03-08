import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";

function ManageHealthAssist() {
    const [healthInfoLoading, setHealthInfoLoading] = useState(false);
    const [refreshRequests, setRefreshRequests] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const { data: allHealthSupportRequestsData, error, loading } = FetchData("/api/partial_admin/health_support_requests", refreshRequests);
    const [showHealthInfo, setShowHealthInfo] = useState(false);
    const [clickedHealthInfo, setClickedHealthInfo] = useState({});

    const handleStatusChange = async (request_id, newStatus) => {
        try {
            document.body.style.cursor = 'wait';
            await httpClient.patch(`/api/partial_admin/health_support_requests`, {
                req_request_id: request_id,
                req_request_status: newStatus,
            });
            Swal.fire("Success", `Status updated to ${newStatus}`, "success");
            setRefreshRequests((prev) => !prev);
            setShowHealthInfo(false);
        } catch (error) {
            Swal.fire("Error", "Failed to update status", "error");
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleDeleteHealth = async (id) => {
        const confirmDialogue = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to continue deleting this request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
    
        if (!confirmDialogue.isConfirmed) return;

        try {
            document.body.style.cursor = 'wait';
            await httpClient.delete('/api/partial_admin/health_support_requests', {
                params: { req_request_id: id }
            });
            setRefreshRequests((prev) => !prev);
            setShowHealthInfo(false);
            Swal.fire('Deleted!', 'The request has been deleted.', 'success');
        } catch (error) {
            Swal.fire('Error', 'An error occurred while deleting the request.', 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleHealthInRowClick = (health) => {
        setClickedHealthInfo(health);
        setShowHealthInfo(true);
    };

    const filteredHealthRequests = allHealthSupportRequestsData?.filter(health =>
        health.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        health.support_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const columns = [
        { name: "Request ID", selector: row => row.request_id, sortable: true },
        { name: "Full Name", selector: row => row.full_name, sortable: true },
        { name: "Resident Type", selector: row => row.resident_type, sortable: true },
        { name: "Support Type", selector: row => row.support_type, sortable: true },
        { name: "Status", selector: row => row.status, sortable: true },
        { name: "Date Created", selector: row => row.date_created, sortable: true },
    ];

    return (
        <div id="manage-health-support-requests" className="flex manage-data">
            <div className="health-controls">
                <input 
                    type="text" 
                    placeholder="Search Health Support Requests" 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <DataTable
                    title="Health Support Requests"
                    columns={columns}
                    data={filteredHealthRequests}
                    pagination
                    highlightOnHover
                    onRowClicked={handleHealthInRowClick}
                />
            </div>
            
            <div className="health-info">
                {!showHealthInfo ? (
                    <h3>Select Health Support Request</h3>
                ) : (
                    <>
                        <h3>{clickedHealthInfo.support_type}</h3>
                        <h4>{clickedHealthInfo.description}</h4>
                        <h4>Status: {clickedHealthInfo.status}</h4>
                        <h5>{clickedHealthInfo.date_created}</h5>

                        {clickedHealthInfo.status === "pending" && (
                            <button onClick={() => handleStatusChange(clickedHealthInfo.request_id, "in_progress")}>
                                Start Processing
                            </button>
                        )}

                        {clickedHealthInfo.status === "in_progress" && (
                            <button onClick={() => handleStatusChange(clickedHealthInfo.request_id, "completed")}>
                                Mark as Completed
                            </button>
                        )}

                        {clickedHealthInfo.status === "completed" && (
                            <button onClick={() => handleStatusChange(clickedHealthInfo.request_id, "pending")}>
                                Reopen Request
                            </button>
                        )}

                        <button onClick={() => handleDeleteHealth(clickedHealthInfo.request_id)}>
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
