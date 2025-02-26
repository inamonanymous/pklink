import { useEffect, useState } from "react";
import CreateHealthAssistModal from "../modals/post/CreateHealthAssistModal";
import FetchData from "../FetchFunction";
import Swal from "sweetalert2";
import httpClient from "../../../httpClient";

function HealthAssist() {
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allUserHealthRequests, error, loading } = FetchData("/api/user/health_support_requests", refreshRequests);
    const [activeView, setActiveView] = useState("create");

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
                document.body.style.cursor = 'wait';
                const resp = await httpClient.delete('/api/user/health_support_requests', {
                    params: { req_request_id: id }
                });
                setRefreshRequests((prev) => !prev);
                Swal.fire('Deleted!', 'The request has been deleted.', 'success')
            } catch (error) {
                console.error(error);
                let errorMsg = 'An error occurred while deleting the request.';
                if (error.response?.status === 403) errorMsg = 'Current user is not allowed.';
                if (error.response?.status === 404) errorMsg = 'Target request not found.';
                if (error.response?.status === 400) errorMsg = 'Invalid request.';
        
                Swal.fire('Error', errorMsg, 'error');
            } finally {
                document.body.style.cursor = 'default';
            }
        };

    return (    
        <div id="health-assist-con">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => setActiveView("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Create Request
                    </button>
                    <button
                        onClick={() => {
                            setActiveView("manage")
                            setRefreshRequests((prev) => !prev);
                        }}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Manage My Requests
                    </button>
                </div>

                {activeView === "create" ? (
                    <CreateHealthAssistModal setRefreshRequests={setRefreshRequests} />
                ) : (
                    <div className="manage-requests">
                        <h3>Manage My Requests</h3>
                        <p>Here, you can view, track, or cancel your health support requests.</p>
                        
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error fetching data.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Support Type</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Date Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUserHealthRequests.length > 0 ? (
                                        allUserHealthRequests.map((request) => (
                                            <tr key={request.health_request_id}>
                                                <td>{request.request_id}</td>
                                                <td>{request.support_type}</td>
                                                <td>{request.description_text}</td>
                                                <td>{request.status}</td>
                                                <td>{new Date(request.date_created).toLocaleString()}</td>
                                                <td>
                                                    {request.status === "pending" && (
                                                        <button 
                                                            className="btn btn-danger btn-sm"
                                                            onClick={handleDeleteHealth}
                                                            data-value={request.request_id}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No requests found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HealthAssist;