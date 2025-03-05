import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreateResidentTypeModal from "../modals/post/CreateResidentTypeModal";

function ManageResidentType() {
    const [refreshResidentType, setRefreshResidentType] = useState(0);
    const { data: allResidentTypes, error, loading } = FetchData("/api/admin/residenttype", refreshResidentType);
    const [showResidentTypeInfo, setShowResidentTypeInfo] = useState(false);
    const [clickedResidentTypeInfo, setClickedResidentTypeInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // Search State
    const [isResidentTypeModalOpen, setIsResidentTypeModalOpen] = useState(false);

    const [activeView, setActiveView] = useState("create");
    const handleViewToggle = (view) => {
        setActiveView(view);
        setIsResidentTypeModalOpen((prevState) => !prevState);
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
            setShowResidentTypeInfo(false);
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
        <div id="manage-resident-type" className="flex-col manage-data">
            
            <div className="btn-group">
                    <button
                        onClick={() => handleViewToggle("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Create Post
                    </button>
                    <button
                        onClick={() => handleViewToggle("manage")}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Manage Posts
                    </button>
                </div>
            {activeView === "create" && (
                <div className="resident-type-create">
                    <CreateResidentTypeModal
                        isResidentTypeModalOpen={isResidentTypeModalOpen}
                        setRefreshResidentTypes={setRefreshResidentType}
                    />
                </div>
            )}
            {activeView === "manage" && (
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
                    />
                </div>
            )}
        </div>
    );
}

export default ManageResidentType;
