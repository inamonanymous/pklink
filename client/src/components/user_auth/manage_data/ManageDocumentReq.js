import React, { useState } from "react";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
function ManageDocumentReq() {
    const [documentInfoLoading, setDocumentInfoLoading] = useState(false);
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allDocumentRequestsData, error, loading } = FetchData("/api/partial_admin/document_requests", refreshRequests);
    const [showDocumentInfo, setShowDocumentInfo] = useState(false);
    const [clickedDocumentInfo, setClickedDocumentInfo] = useState({});

    const handleStatusChange = async (request_id, newStatus) => {
        try {
            document.body.style.cursor = 'wait';
            await httpClient.patch(`/api/partial_admin/document_requests`, {
                req_request_id: request_id,
                req_request_status: newStatus,
            });
            Swal.fire("Success", `Status updated to ${newStatus}`, "success");
            setRefreshRequests((prev) => !prev); // Refresh list
            setShowDocumentInfo(false);
        } catch (error) {
            Swal.fire("Error", "Failed to update status", "error");
        } finally {
            document.body.style.cursor = 'default';
        }
    };
    

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
            const resp = await httpClient.delete('/api/partial_admin/document_requests', {
                params: { req_request_id: id }
            });
            setRefreshRequests((prev) => !prev);
            setShowDocumentInfo(false);
            Swal.fire('Deleted!', 'The request has been deleted.', 'success')
        } catch (error) {
            console.error(error);
            let errorMsg = 'An error occurred while deleting the rewu.';
            if (error.response?.status === 403) errorMsg = 'Current user is not allowed.';
            if (error.response?.status === 404) errorMsg = 'Target post not found.';
            if (error.response?.status === 400) errorMsg = 'Invalid request.';
    
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleDocumentInRowClick = async (e, document_id) => {
        e.preventDefault();
        setDocumentInfoLoading(true);

        const clickedDocument = allDocumentRequestsData.find((document) => document.document_request_id === document_id);
        if (!clickedDocument) {
            console.error("Document request not found");
            setDocumentInfoLoading(false);
            return;
        }
        console.log(clickedDocument);
        setClickedDocumentInfo(clickedDocument);
        setDocumentInfoLoading(false);
        setShowDocumentInfo(true);
        setRefreshRequests((prev) => !prev); // Toggle state to refresh
    };

    return (
        <div id="manage-document-requests" className="flex manage-data">
            <div className="document-controls">
                <input type="text" placeholder="Search Document Requests" />
                
                <div className="table-con">
                    <table className="table table-bordered table-hover table-stripped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Request ID</th>
                                <th scope="col">Full name</th>
                                <th scope="col">Resident Type</th>
                                <th scope="col">Document Type</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allDocumentRequestsData === null || allDocumentRequestsData.length === 0 ? (
                                <>No document requests</>
                            ) : (
                                allDocumentRequestsData.map((document) => (
                                    <tr 
                                        key={document.request_id}
                                        onClick={(e) => handleDocumentInRowClick(e, document.document_request_id)}
                                    >
                                        <td>{document.request_id}</td>
                                        <td>{document.full_name}</td>
                                        <td>{document.resident_type}</td>
                                        <td>{document.document_type}</td>
                                        <td>{document.status}</td>
                                        <td>{document.date_created}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="document-info">
                {!showDocumentInfo ? (
                    <h3>Select Document Request</h3>
                ) : documentInfoLoading ? (
                    <h3>Loading...</h3>
                ) : (
                    <>
                        <h3>{clickedDocumentInfo.document_type}</h3>
                        <h4>{clickedDocumentInfo.description}</h4>
                        <h4>Status: {clickedDocumentInfo.status}</h4>
                        <h5>{clickedDocumentInfo.date_created}</h5>

                        {/* Status-based buttons */}
                        {clickedDocumentInfo.status === "pending" && (
                            <>
                                <button onClick={() => handleStatusChange(clickedDocumentInfo.request_id, "in_progress")}>
                                    Start Processing
                                </button>
                            </>
                        )}

                        {clickedDocumentInfo.status === "in_progress" && (
                            <>
                                <button onClick={() => handleStatusChange(clickedDocumentInfo.request_id, "completed")}>
                                    Mark as Completed
                                </button>
                            </>
                        )}

                        {clickedDocumentInfo.status === "completed" && (
                            <button onClick={() => handleStatusChange(clickedDocumentInfo.request_id, "pending")}>
                                Reopen Request
                            </button>
                        )}

                        {/* Common actions */}
                        <button onClick={handleDeleteDocument} data-value={clickedDocumentInfo.request_id}>
                            Delete Request
                        </button>
                        <button>Edit Request</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageDocumentReq;
