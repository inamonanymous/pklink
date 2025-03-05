import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";

function ManageReportIncident() {
    const timestamp = Date.now();
    const [refreshIncidents, setRefreshIncidents] = useState(0);
    const { data: allIncidentReports, error, loading } = FetchData("/api/partial_admin/incidents", refreshIncidents);
    const [showIncidentInfo, setShowIncidentInfo] = useState(false);
    const [clickedIncidentInfo, setClickedIncidentInfo] = useState({});

    const handleStatusChange = async (incident_id, newStatus) => {
        try {
            document.body.style.cursor = "wait";
            await httpClient.patch("/api/partial_admin/incidents", {
                req_incident_id: incident_id,
                req_incident_status: newStatus,
            });
            Swal.fire("Success", `Status updated to ${newStatus}`, "success");
            setRefreshIncidents((prev) => !prev);
            setShowIncidentInfo(false);
        } catch (error) {
            Swal.fire("Error", "Failed to update status", "error");
        } finally {
            document.body.style.cursor = "default";
        }
    };

    const handleDeleteIncident = async (e, id) => {
        e.preventDefault();
        const confirmDialogue = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this incident?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });
        if (!confirmDialogue.isConfirmed) return;

        try {
            document.body.style.cursor = "wait";
            await httpClient.delete("/api/partial_admin/incidents", {
                params: { req_incident_id: id },
            });
            setRefreshIncidents((prev) => !prev);
            setShowIncidentInfo(false);
            Swal.fire("Deleted!", "The Incident report has been deleted.", "success");
        } catch (error) {
            Swal.fire("Error!", `${error.response.data.message}`, "error");
        } finally {
            document.body.style.cursor = "default";
        }
    };

    const handleIncidentClick = (incident) => {
        setClickedIncidentInfo(incident);
        setShowIncidentInfo(true);
    };


    const [searchQuery, setSearchQuery] = useState(""); // Search State

    // Filter incidents based on search query
    const filteredIncidents = allIncidentReports?.filter((incident) =>
        Object.values(incident).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

    const columns = [
        { name: "Incident ID", selector: (row) => row.incident_id, sortable: true },
        { name: "Reported By", selector: (row) => `${row.user_firstname} ${row.user_middlename} ${row.user_lastname}`, sortable: true },
        { name: "Status", selector: (row) => row.incident_status, sortable: true },
        { name: "Location", selector: (row) => row.incident_location, sortable: true },
        { name: "Date Created", selector: (row) => new Date(row.incident_date_created).toLocaleString(), sortable: true },
    ];

    return (
        <div id="manage-incident-reports" className="flex manage-data">
            <div className="incident-controls">
                <input 
                    type="text"
                    placeholder="Search Incident Reports" 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                <DataTable
                    title="Incident Reports"
                    columns={columns}
                    data={filteredIncidents}
                    pagination
                    highlightOnHover
                    onRowClicked={handleIncidentClick}
                />
            </div>

            <div className="incident-info">
                {!showIncidentInfo ? (
                    <h3>Select an Incident Report</h3>
                ) : (
                    <>
                        <h3>{clickedIncidentInfo.incident_description}</h3>
                        <h4>Status: {clickedIncidentInfo.incident_status}</h4>
                        <h4>Location: {clickedIncidentInfo.incident_location}</h4>
                        <h5>Date Created: {new Date(clickedIncidentInfo.incident_date_created).toLocaleString()}</h5>
                        {clickedIncidentInfo.incident_photo_path && (
                            <img
                                src={`https://storage.googleapis.com/pklink/${clickedIncidentInfo.incident_photo_path.replace(/\\/g, "/")}?v=${timestamp}`}
                                alt="Incident"
                                style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", marginTop: "10px" }}
                            />
                        )}
                        <div className="btn-group">
                            <button onClick={(e) => handleDeleteIncident(e, clickedIncidentInfo.incident_id)}>
                                Delete Incident
                            </button>
                            {clickedIncidentInfo.incident_status === "pending" && (
                                <button onClick={() => handleStatusChange(clickedIncidentInfo.incident_id, "open")}>
                                    Open Incident
                                </button>
                            )}
                            {clickedIncidentInfo.incident_status === "open" && (
                                <button onClick={() => handleStatusChange(clickedIncidentInfo.incident_id, "closed")}>
                                    Close Incident
                                </button>
                            )}
                            {clickedIncidentInfo.incident_status === "closed" && (
                                <button onClick={() => handleStatusChange(clickedIncidentInfo.incident_id, "pending")}>
                                    Make Incident Pending
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageReportIncident;
