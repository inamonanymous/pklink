import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreateResidentTypeModal from "../modals/post/CreateResidentTypeModal";

function ManageResidentType() {
    const [refreshResidentType, setRefreshResidentType] = useState(0);
    const { data: allResidentTypes } = FetchData("/api/admin/residenttype", refreshResidentType);
    const [selectedResidentType, setSelectedResidentType] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isResidentTypeModalOpen, setIsResidentTypeModalOpen] = useState(false);
    const [activeView, setActiveView] = useState("manage"); // Set "manage" as the initial view


    const handleViewToggle = (view) => {
        setActiveView(view);
        if (view === "create") {
            setIsResidentTypeModalOpen(true); // Open modal when "create" is selected
            setSelectedResidentType(null);
        } else {
            setIsResidentTypeModalOpen(false); // Close modal when not in "create"
        }
    };

    const handleEditResidentType = async () => {
        if (!selectedResidentType) {
            Swal.fire("Error!", "No resident type selected.", "error");
            return;
        }
    
        const { value: formValues } = await Swal.fire({
            title: "Edit Resident Type",
            html: `
                <input id="req_resident_type_name" class="swal2-input" placeholder="Resident Type Name" value="${selectedResidentType.resident_type_name}">
                <label><input type="checkbox" id="req_manage_post" ${selectedResidentType.resident_manage_post ? "checked" : ""}> Manage Post</label><br>
                <label><input type="checkbox" id="req_add_post" ${selectedResidentType.resident_add_post ? "checked" : ""}> Add Post</label><br>
                <label><input type="checkbox" id="req_manage_event" ${selectedResidentType.resident_manage_event ? "checked" : ""}> Manage Event</label><br>
                <label><input type="checkbox" id="req_add_event" ${selectedResidentType.resident_add_event ? "checked" : ""}> Add Event</label><br>
                <label><input type="checkbox" id="req_manage_announcement" ${selectedResidentType.resident_manage_announcement ? "checked" : ""}> Manage Announcement</label><br>
                <label><input type="checkbox" id="req_add_announcement" ${selectedResidentType.resident_add_announcement ? "checked" : ""}> Add Announcement</label><br>
                <label><input type="checkbox" id="req_view_accounts" ${selectedResidentType.resident_view_accounts ? "checked" : ""}> View Accounts</label><br>
                <label><input type="checkbox" id="req_control_accounts" ${selectedResidentType.resident_control_accounts ? "checked" : ""}> Control Accounts</label><br>
                <label><input type="checkbox" id="req_partial_admin" ${selectedResidentType.resident_partial_admin ? "checked" : ""}> Partial Admin</label><br>
                <label><input type="checkbox" id="req_manage_request" ${selectedResidentType.resident_manage_request ? "checked" : ""}> Manage Request</label><br>
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    req_resident_type_id: selectedResidentType.resident_type_id,
                    req_resident_type_name: document.getElementById("req_resident_type_name").value,
                    req_manage_post: document.getElementById("req_manage_post").checked,
                    req_add_post: document.getElementById("req_add_post").checked,
                    req_manage_event: document.getElementById("req_manage_event").checked,
                    req_add_event: document.getElementById("req_add_event").checked,
                    req_manage_announcement: document.getElementById("req_manage_announcement").checked,
                    req_add_announcement: document.getElementById("req_add_announcement").checked,
                    req_view_accounts: document.getElementById("req_view_accounts").checked,
                    req_control_accounts: document.getElementById("req_control_accounts").checked,
                    req_partial_admin: document.getElementById("req_partial_admin").checked,
                    req_manage_request: document.getElementById("req_manage_request").checked,
                };
            }
        });
    
        if (!formValues) return;
    
        try {
            document.body.style.cursor = "wait";
            const { data } = await httpClient.put("/api/admin/residenttype", formValues);
            setIsResidentTypeModalOpen(false); // Close modal when not in "create"
            setRefreshResidentType((prev) => !prev);
            setSelectedResidentType(null);
            Swal.fire("Updated!", data.message, "success");
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.message || "Something went wrong", "error");
        } finally {
            document.body.style.cursor = "default";
        }
    };
    
    // Fetch single resident type on row click
    const handleRowClick = async (row) => {
        try {
            document.body.style.cursor = 'wait';
            const { data } = await httpClient.patch("/api/admin/residenttype", {
                req_resident_type_id: row.resident_type_id
            });
            setSelectedResidentType(data);
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.message || "Failed to fetch details", "error");
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    // Delete Resident Type
    const handleDeleteResidentType = async (e, id) => {
        e.preventDefault();
        const confirmDialogue = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this resident type?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });
        if (!confirmDialogue.isConfirmed) return;

        try {
            document.body.style.cursor = "wait";
            await httpClient.delete("/api/admin/residenttype", {
                params: { req_resident_type_id: id },
            });
            setRefreshResidentType((prev) => prev + 1);
            setSelectedResidentType(null);
            Swal.fire("Deleted!", "The Resident Type has been deleted.", "success");
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.message || "Something went wrong", "error");
        } finally {
            document.body.style.cursor = "default";
        }
    };

    // Search Filter
    const filteredResidentTypes = allResidentTypes?.filter((residentType) =>
        residentType.resident_type_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Table Columns
    const columns = [
        { name: "ID", selector: (row) => row.resident_type_id, sortable: true },
        { name: "Resident Type", selector: (row) => row.resident_type_name, sortable: true },
        { 
            name: "Actions", 
            cell: (row) => (
                <button onClick={(e) => handleDeleteResidentType(e, row.resident_type_id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
                    🗑 Delete
                </button>
            )
        }
    ];

    return (
        <div id="manage-resident-type" className="flex manage-data">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => handleViewToggle("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Create Resident Type
                    </button>
                    <button
                        onClick={() => handleViewToggle("manage")}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Manage Resident Type
                    </button>
                </div>

                {activeView === "create" ? (
                    <div className="resident-type-create">
                        <CreateResidentTypeModal
                            isResidentTypeModalOpen={isResidentTypeModalOpen}
                            setRefreshResidentTypes={setRefreshResidentType}
                        />
                    </div>
                ) : (
                    <div className="resident-type-controls">
                        <input 
                            type="text"
                            placeholder="Search Resident Type" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
                        />
                        <DataTable
                            title="Resident Type Management"
                            columns={columns}
                            data={filteredResidentTypes}
                            pagination
                            highlightOnHover
                            onRowClicked={handleRowClick} // Fetch on click
                            pointerOnHover
                        />
                    </div>
                )}

            </div>

            {selectedResidentType && (
                <div className="resident-type-info">
                    <h3>Resident Type Details</h3>
                    <p><strong>ID:</strong> {selectedResidentType.resident_type_id}</p>
                    <p><strong>Type:</strong> {selectedResidentType.resident_type_name}</p>
                    <p><strong>Manage Post:</strong> {selectedResidentType.resident_manage_post ? "Yes" : "No"}</p>
                    <p><strong>Add Post:</strong> {selectedResidentType.resident_add_post ? "Yes" : "No"}</p>
                    <p><strong>Manage Event:</strong> {selectedResidentType.resident_manage_event ? "Yes" : "No"}</p>
                    <p><strong>Add Event:</strong> {selectedResidentType.resident_add_event ? "Yes" : "No"}</p>
                    <p><strong>Manage Announcement:</strong> {selectedResidentType.resident_manage_announcement ? "Yes" : "No"}</p>
                    <p><strong>Add Announcement:</strong> {selectedResidentType.resident_add_announcement ? "Yes" : "No"}</p>
                    <p><strong>View Accounts:</strong> {selectedResidentType.resident_view_accounts ? "Yes" : "No"}</p>
                    <p><strong>Control Accounts:</strong> {selectedResidentType.resident_control_accounts ? "Yes" : "No"}</p>
                    <p><strong>Partial Admin:</strong> {selectedResidentType.resident_partial_admin ? "Yes" : "No"}</p>
                    <p><strong>Manage Request:</strong> {selectedResidentType.resident_manage_request ? "Yes" : "No"}</p>
                    <p><strong>Modified By:</strong> {selectedResidentType.modified_by}</p>
                    <p><strong>Last Modified:</strong> {new Date(selectedResidentType.last_modified).toLocaleString()}</p>

                    <div className="btn-group">
                        <button onClick={handleEditResidentType} className="btn btn-warning">✏ Edit</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ManageResidentType;
