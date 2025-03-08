import React, { useState } from "react";
import FetchData from "../FetchFunction";
import CreateIncidentModal from "../modals/post/CreateIncidentModal";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import EditCurrentUserIncident from "../modals/put/EditCurrentUserIncidents";
import { useTranslation } from 'react-i18next';
function ReportIncident() {
    const { t } = useTranslation();
    const [refreshIncidents, setRefreshIncidents] = useState(0);
    const [activeView, setActiveView] = useState("create");    
    const { data: allUserIncidents, error, loading } = FetchData("/api/user/incidents", refreshIncidents);
    let timestamp = Date.now()

    

    const handleDeleteIncident = async (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to continue deleting this incident?",
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
            await httpClient.delete('/api/user/incidents', {
                params: { req_incident_id: id }
            });
            setRefreshIncidents((prev) => !prev);
            Swal.fire('Deleted!', 'The Incident Report has been deleted.', 'success')
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', `${error.response.data.message}`, 'error')
        } finally {
            document.body.style.cursor = 'default';
        }
    };
    return (
        <div id="report-incident-con">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => setActiveView("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        {t('content_panel.incident.create_incident')}
                    </button>
                    <button
                        onClick={() => {
                            setActiveView("manage")
                            setRefreshIncidents((prev) => !prev);
                        }}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        {t('content_panel.incident.manage_my_incidents')}
                    </button>
                </div>

                {activeView === "create" ? (
                    <CreateIncidentModal />
                ) : (
                    <div className="manage-incidents">
                        
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>Error fetching data.</p>
                        ) : allUserIncidents.length === 0 ? (
                            <p>No document requests found.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Incident ID</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Location</th>
                                        <th>Photo</th>
                                        <th>Date Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {allUserIncidents.map((incident) => (
                                            <tr key={incident.incident_id}>
                                                <td>{incident.incident_id}</td>
                                                <td>{incident.description}</td>
                                                <td>{incident.status}</td>
                                                <td>{incident.location}</td>
                                                <td>
                                                    {incident.photo_path ? (
                                                        <a href={`https://storage.googleapis.com/pklink/${incident.photo_path.replace(/\\/g, "/")}?v=${timestamp}`} target="_blank" rel="noopener noreferrer">
                                                            <img
                                                                src={`https://storage.googleapis.com/pklink/${incident.photo_path.replace(/\\/g, "/")}?v=${timestamp}`}
                                                                alt="Incident"
                                                                style={{ width: "100%", maxWidth: "300px", borderRadius: "10px" }}
                                                            />
                                                        </a>
                                                    ) : (
                                                        <p>No Image</p>
                                                    )}
                                                </td>
                                                <td>{new Date(incident.date_created).toLocaleString()}</td>
                                                <td>
                                                    {incident.status === "pending" && (
                                                        <div className="btn-group">
                                                            <button 
                                                                className="btn btn-danger btn-sm"
                                                                onClick={handleDeleteIncident}
                                                                data-value={incident.incident_id}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => EditCurrentUserIncident(
                                                                    allUserIncidents,
                                                                    incident.incident_id,
                                                                    setRefreshIncidents
                                                                )}
                                                                data-value={incident.incident_id}
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportIncident;
