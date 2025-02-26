import React, { useState } from "react";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";

function ManageReportIncident() {
    const timestamp = Date.now()
    const [incidentInfoLoading, setIncidentInfoLoading] = useState(false);
    const [refreshIncidents, setRefreshIncidents] = useState(0);
    const { data: allIncidentReports, error, loading } = FetchData("/api/partial_admin/incidents", refreshIncidents);
    const [showIncidentInfo, setShowIncidentInfo] = useState(false);
    const [clickedIncidentInfo, setClickedIncidentInfo] = useState({});

    const handleDeleteIncident = async (e) => {
        const id = e.currentTarget.getAttribute('data-value');
        e.preventDefault();
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
            await httpClient.delete('/api/partial_admin/incidents', {
                params: { req_incident_id: id }
            });
            setRefreshIncidents((prev) => !prev);
            setShowIncidentInfo(false);
            Swal.fire('Deleted!', 'The Incident report has been deleted.', 'success')
        } catch (error) {
            console.log(error);
            Swal.fire('Error!', `${error.response.data.message}`, 'error')
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleIncidentInRowClick = async (e, incident_id) => {
        e.preventDefault();
        setIncidentInfoLoading(true);

        const clickedIncident = allIncidentReports.find((incident) => incident.incident_id === incident_id);
        if (!clickedIncident) {
            console.error("Incident report not found");
            setIncidentInfoLoading(false);
            return;
        }

        setClickedIncidentInfo(clickedIncident);
        setIncidentInfoLoading(false);
        setShowIncidentInfo(true);
        setRefreshIncidents((prev) => !prev);
    };

    return (
        <div id="manage-incident-reports" className="flex manage-data">
            <div className="incident-controls">
                <input type="text" placeholder="Search Incident Reports" />

                <div className="table-con">
                    <table className="table table-bordered table-hover table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Incident ID</th>
                                <th scope="col">Reported By</th>
                                <th scope="col">Status</th>
                                <th scope="col">Location</th>
                                <th scope="col">Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allIncidentReports === null || allIncidentReports.length === 0 ? (
                                <>No incident reports</>
                            ) : (
                                allIncidentReports.map((incident) => (
                                    <tr 
                                        key={incident.incident_id}
                                        onClick={(e) => handleIncidentInRowClick(e, incident.incident_id)}
                                    >
                                        <td>{incident.incident_id}</td>
                                        <td>{incident.user_firstname} {incident.user_middlename} {incident.user_lastname}</td>
                                        <td>{incident.incident_status}</td>
                                        <td>{incident.incident_location}</td>
                                        <td>{new Date(incident.incident_date_created).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="incident-info">
                {!showIncidentInfo ? (
                    <h3>Select an Incident Report</h3>
                ) : incidentInfoLoading ? (
                    <h3>Loading...</h3>
                ) : (
                    <>
                        <h3>{clickedIncidentInfo.incident_description}</h3>
                        <h4>Status: {clickedIncidentInfo.incident_status}</h4>
                        <h4>Location: {clickedIncidentInfo.incident_location}</h4>
                        <h5>Date Created: {new Date(clickedIncidentInfo.incident_date_created).toLocaleString()}</h5>
                        {clickedIncidentInfo.incident_photo_path && (
                            <img
                                src={`${`https://storage.googleapis.com/pklink/${clickedIncidentInfo.incident_photo_path.replace(/\\/g, "/")}?v=${timestamp}`}`}
                                alt="Incident"
                                
                                style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", marginTop: "10px" }}
                            />
                        )}
                        <button
                            onClick={handleDeleteIncident}
                            data-value={clickedIncidentInfo.incident_id}
                        >
                            Delete Incident
                        </button>
                        <button>Edit Incident</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageReportIncident;
