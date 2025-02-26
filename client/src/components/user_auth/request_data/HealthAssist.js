import { useEffect, useState } from "react";
import CreateHealthAssistModal from "../modals/post/CreateHealthAssistModal";
import FetchData from "../FetchFunction";

function HealthAssist() {
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allUserHealthRequests, error, loading } = FetchData("/api/user/health_support_requests", refreshRequests);
    const [activeView, setActiveView] = useState("create");

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
                        onClick={() => setActiveView("manage")}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Manage My Requests
                    </button>
                </div>

                {activeView === "create" ? (
                    <CreateHealthAssistModal isOpen={true} setRefreshRequests={setRefreshRequests} />
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