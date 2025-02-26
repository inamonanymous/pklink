import { useEffect, useState } from "react";
import CreateDocumentReqModal from "../modals/post/CreateDocumentReqModal";
import FetchData from "../FetchFunction";

function DocumentReq() {
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allUserDocumentRequestsData, error, loading } = FetchData("/api/user/document_requests", refreshRequests);

    const [activeView, setActiveView] = useState("create"); // 'create' or 'manage'

    return (
        <div id="document-req-con">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => setActiveView("create") }
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
                    <CreateDocumentReqModal 
                        setRefreshRequests={setRefreshRequests}
                    />
                ) : (
                    <div className="manage-requests">
                        <h3>Manage My Requests</h3>
                        <p>Here, you can view, track, or cancel your document requests.</p>

                        {loading ? (
                            <p>Loading requests...</p>
                        ) : error ? (
                            <p className="error">Error fetching document requests.</p>
                        ) : allUserDocumentRequestsData.length === 0 ? (
                            <p>No document requests found.</p>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Document Type</th>
                                            <th>Status</th>
                                            <th>Request Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUserDocumentRequestsData.map((request) => (
                                            <tr key={request.document_request_id}>
                                                <td>{request.document_request_id}</td>
                                                <td>{request.document_type}</td>
                                                <td>
                                                    <span className={`status ${request.status.toLowerCase()}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(request.date_created).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm">
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentReq;
