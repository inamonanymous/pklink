import React, { useState } from "react";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";

function ManageDocumentReq() {
    const [documentInfoLoading, setDocumentInfoLoading] = useState(false);
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allDocumentRequestsData, error, loading } = FetchData("/api/partial_admin/document_requests", refreshRequests);
    const [showDocumentInfo, setShowDocumentInfo] = useState(false);
    const [clickedDocumentInfo, setClickedDocumentInfo] = useState({});


    const handleDeleteDocument = async (e) => {
        e.preventDefault();
        const confirmDialogue = window.confirm("Do you want to continue deleting this document request?");
        if (!confirmDialogue) {
            return;
        }
        try {
            const id = e.currentTarget.getAttribute('data-value');
            const resp = await httpClient.delete('/api/partial_admin/document_requests', {
                params: { req_request_id: id }
            });
            setRefreshRequests((prev) => !prev);
            setShowDocumentInfo(false);
            alert('Document request deleted');
        } catch (error) {
            console.error(error);
            alert('Error deleting document request');
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
                        <h4>{clickedDocumentInfo.status}</h4>
                        <h5>{clickedDocumentInfo.date_created}</h5>
                        <button
                            onClick={handleDeleteDocument}
                            data-value={clickedDocumentInfo.request_id}
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

export default ManageDocumentReq;
