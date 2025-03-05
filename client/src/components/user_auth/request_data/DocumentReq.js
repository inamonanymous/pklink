import { useEffect, useState } from "react";
import CreateDocumentReqModal from "../modals/post/CreateDocumentReqModal";
import FetchData from "../FetchFunction";
import Swal from "sweetalert2";
import httpClient from "../../../httpClient";
import EditCurrentUserDocumentReqModal from "../modals/put/EditCurrentUserDocumentReqModal";
import { useTranslation } from 'react-i18next';

function DocumentReq() {
    const { t } = useTranslation();

    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allUserDocumentRequestsData, error, loading } = FetchData("/api/user/document_requests", refreshRequests);

    const [activeView, setActiveView] = useState("create"); // 'create' or 'manage'

    const handleDeleteDocument = async (e) => {
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
                const resp = await httpClient.delete('/api/user/document_requests', {
                    params: { req_request_id: id }
                });
                setRefreshRequests((prev) => !prev);
                Swal.fire('Deleted!', 'The request has been deleted.', 'success')
            } catch (error) {
                console.error(error);
                let errorMsg = 'An error occurred while deleting the rewu.';
                if (error.response?.status === 403) errorMsg = 'Current user is not allowed.';
                if (error.response?.status === 404) errorMsg = 'Target post not found.';
                if (error.response?.status === 400) errorMsg = 'Invalid Request';
                if (error.response?.status === 500) errorMsg = `Internal server error (it's on our fault :>)`;
        
                Swal.fire('Error', errorMsg, 'error');
            } finally {
                document.body.style.cursor = 'default';
            }
    };

    return (
        <div id="document-req-con">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => setActiveView("create") }
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        {t('content_panel.document_requests.create_request')}
                    </button>
                    <button
                        onClick={() => {
                            setActiveView("manage")
                            setRefreshRequests((prev) => !prev);
                        }}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        {t('content_panel.document_requests.manage_my_requests')}
                    </button>
                </div>

                {activeView === "create" ? (
                    <CreateDocumentReqModal 
                        setRefreshRequests={setRefreshRequests}
                    />
                ) : (
                    <div className="manage-requests">
                        {t('content_panel.document_requests.manage_my_requests')}
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
                                            <th>Reason</th>
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
                                                <td>{request.reason}</td>
                                                <td>{new Date(request.date_created).toLocaleDateString()}</td>
                                                <td>
                                                    {request.status ==="pending" && (
                                                        <div className="btn-group">
                                                            <button 
                                                                className="btn btn-danger btn-sm"
                                                                onClick={handleDeleteDocument}
                                                                data-value={request.request_id}
                                                            >
                                                                {t('content_panel.delete')}
                                                            </button>
                                                            <button 
                                                                className="btn btn-warning btn-sm"
                                                                onClick={(e) => 
                                                                    EditCurrentUserDocumentReqModal(
                                                                        allUserDocumentRequestsData,
                                                                        request.request_id,
                                                                        setRefreshRequests
                                                                    )
                                                                }
                                                                data-value={request.request_id}
                                                            >
                                                                {t('content_panel.edit')}
                                                            </button>
                                                        </div>
                                                    )}
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
