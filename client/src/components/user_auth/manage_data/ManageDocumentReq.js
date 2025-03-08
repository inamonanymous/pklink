import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";

function ManageDocumentReq() {
    const [documentInfoLoading, setDocumentInfoLoading] = useState(false);
    const [refreshRequests, setRefreshRequests] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
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
            setRefreshRequests((prev) => !prev);
            setShowDocumentInfo(false);
        } catch (error) {
            Swal.fire("Error", "Failed to update status", "error");
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleDeleteDocument = async (id) => {
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
            await httpClient.delete('/api/partial_admin/document_requests', {
                params: { req_request_id: id }
            });
            setRefreshRequests((prev) => !prev);
            setShowDocumentInfo(false);
            Swal.fire('Deleted!', 'The request has been deleted.', 'success');
        } catch (error) {
            Swal.fire('Error', 'An error occurred while deleting the request.', 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleDocumentInRowClick = (document) => {
        setClickedDocumentInfo(document);
        setShowDocumentInfo(true);
    };

    const filteredDocuments = allDocumentRequestsData?.filter(document =>
        document.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.document_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const columns = [
        { name: "Request ID", selector: row => row.request_id, sortable: true },
        { name: "Full Name", selector: row => row.full_name, sortable: true },
        { name: "Resident Type", selector: row => row.resident_type, sortable: true },
        { name: "Document Type", selector: row => row.document_type, sortable: true },
        { name: "Status", selector: row => row.status, sortable: true },
        { name: "Date Created", selector: row => row.date_created, sortable: true },
    ];

    return (
        <div id="manage-document-requests" className="flex manage-data">
            <div className="document-controls">
                <input 
                    type="text" 
                    placeholder="Search Document Requests" 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <DataTable
                    title="Document Requests"
                    columns={columns}
                    data={filteredDocuments}
                    pagination
                    highlightOnHover
                    onRowClicked={handleDocumentInRowClick}
                />
            </div>
            
            <div className="document-info">
                {!showDocumentInfo ? (
                    <h3>Select Document Request</h3>
                ) : (
                    <>
                        <h3>{clickedDocumentInfo.document_type}</h3>
                        <h4>{clickedDocumentInfo.description}</h4>
                        <h4>Status: {clickedDocumentInfo.status}</h4>
                        <h5>{clickedDocumentInfo.date_created}</h5>

                        {clickedDocumentInfo.status === "pending" && (
                            <button onClick={() => handleStatusChange(clickedDocumentInfo.request_id, "in_progress")}>
                                Start Processing
                            </button>
                        )}

                        {clickedDocumentInfo.status === "in_progress" && (
                            <button onClick={() => handleStatusChange(clickedDocumentInfo.request_id, "completed")}>
                                Mark as Completed
                            </button>
                        )}

                        {clickedDocumentInfo.status === "completed" && (
                            <button onClick={() => handleStatusChange(clickedDocumentInfo.request_id, "pending")}>
                                Reopen Request
                            </button>
                        )}

                        <button onClick={() => handleDeleteDocument(clickedDocumentInfo.request_id)}>
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
