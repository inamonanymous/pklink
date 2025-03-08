import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreateDocumentReqModal from "../modals/post/CreateDocumentReqModal";
import EditCurrentUserDocumentReqModal from "../modals/put/EditCurrentUserDocumentReqModal";
import { useTranslation } from 'react-i18next';

function DocumentReq() {
    const { t } = useTranslation();
    const [refreshRequests, setRefreshRequests] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeView, setActiveView] = useState("create");
    const { data: allUserDocumentRequestsData, error, loading } = FetchData("/api/user/document_requests", refreshRequests);

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
            await httpClient.delete('/api/user/document_requests', {
                params: { req_request_id: id }
            });
            setRefreshRequests((prev) => !prev);
            Swal.fire('Deleted!', 'The request has been deleted.', 'success');
        } catch (error) {
            Swal.fire('Error', 'An error occurred while deleting the request.', 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const filteredDocumentRequests = allUserDocumentRequestsData?.filter(request =>
        request.document_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const columns = [
        { name: "ID", selector: row => row.document_request_id, sortable: true },
        { name: "Document Type", selector: row => row.document_type, sortable: true },
        { name: "Status", selector: row => row.status, sortable: true },
        { name: "Reason", selector: row => row.reason, sortable: true },
        { name: "Request Date", selector: row => new Date(row.date_created).toLocaleDateString(), sortable: true },
        {
            name: "Actions", cell: row => (
                row.status === "pending" ? (
                    <div className="btn-group">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDocument(row.request_id)}>
                            {t('content_panel.delete')}
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={() => EditCurrentUserDocumentReqModal(allUserDocumentRequestsData, row.request_id, setRefreshRequests)}>
                            {t('content_panel.edit')}
                        </button>
                    </div>
                ) : null
            )
        }
    ];

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
                    <CreateDocumentReqModal setRefreshRequests={setRefreshRequests} />
                ) : (
                    <div className="manage-requests">
                        {t('content_panel.document_requests.manage_my_requests')}
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
                            data={filteredDocumentRequests}
                            pagination
                            highlightOnHover
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentReq;
