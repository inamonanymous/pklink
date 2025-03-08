import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreateHealthAssistModal from "../modals/post/CreateHealthAssistModal";
import EditCurrentUserHealthAssistModal from "../modals/put/EditCurrentUserHealthAssistModal";
import { useTranslation } from 'react-i18next';

function HealthAssist() {
    const { t } = useTranslation();
    const [refreshRequests, setRefreshRequests] = useState(0);
    const { data: allUserHealthRequests, error, loading } = FetchData("/api/user/health_support_requests", refreshRequests);
    const [activeView, setActiveView] = useState("create");

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
            await httpClient.delete('/api/user/health_support_requests', {
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

    const columns = [
        { name: "Request ID", selector: row => row.request_id, sortable: true },
        { name: "Support Type", selector: row => row.support_type, sortable: true },
        { name: "Description", selector: row => row.description_text, sortable: true },
        { name: "Status", selector: row => row.status, sortable: true },
        { name: "Date Created", selector: row => new Date(row.date_created).toLocaleString(), sortable: true },
        {
            name: "Actions", cell: row => (
                row.status === "pending" ? (
                    <div className="btn-group">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteHealth(row.request_id)}>
                            Cancel
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={() => EditCurrentUserHealthAssistModal(allUserHealthRequests, row.request_id, setRefreshRequests)}>
                            Edit
                        </button>
                    </div>
                ) : null
            )
        }
    ];

    return (    
        <div id="health-assist-con">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => setActiveView("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        {t('content_panel.health_support.request_assistance')}
                    </button>
                    <button
                        onClick={() => {
                            setActiveView("manage")
                            setRefreshRequests((prev) => !prev);
                        }}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        {t('content_panel.health_support.manage_my_requests')}
                    </button>
                </div>

                {activeView === "create" ? (
                    <CreateHealthAssistModal setRefreshRequests={setRefreshRequests} />
                ) : (
                    <div className="manage-requests">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error fetching data.</p>
                        ) : allUserHealthRequests.length === 0 ? (
                            <p>No document requests found.</p>
                        ) : (
                            <DataTable
                                title="Health Support Requests"
                                columns={columns}
                                data={allUserHealthRequests}
                                pagination
                                highlightOnHover
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HealthAssist;
