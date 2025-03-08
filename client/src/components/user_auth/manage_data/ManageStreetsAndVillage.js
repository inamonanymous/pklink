import { useState } from "react";
import FetchData from "../FetchFunction";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import httpClient from "../../../httpClient";


function ManageStreetsAndVillage() {
    const [activeTab, setActiveTab] = useState("villages");
    const [refreshLocations, setRefreshLocations] = useState(false);
    // Fetch Data
    const { data: allBrgyStreetsData, error: streetsError, loading: streetsLoading } = FetchData("/api/user/brgystreets", refreshLocations);
    const { data: allVillagesData, error: villagesError, loading: villagesLoading } = FetchData("/api/user/villages", refreshLocations);

    // Handle Add Village
    const handleAddVillage = () => {
        Swal.fire({
            title: "Add Village",
            input: "text",
            inputLabel: "Village Name",
            showCancelButton: true,
            confirmButtonText: "Add",
        }).then((result) => {
            if (result.isConfirmed) {
                httpClient.post('/api/partial_admin/villages', {
                    req_village_name: result.value,
                })
                    .then((data) => {
                        Swal.fire("Success!", data.message, "success");
                        setRefreshLocations((prev) => {
                            return !prev;
                        });
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message || "Failed to add village", "error");
                    });
            }
        });
    };

    // Handle Add Street
    const handleAddStreet = () => {
        Swal.fire({
            title: "Add Street",
            html: `
                <input id="street-name" class="swal2-input" placeholder="Street Name" />
                <input type="number" id="purok" class="swal2-input" placeholder="Purok" />
            `,
            showCancelButton: true,
            confirmButtonText: "Add",
            focusConfirm: false,
            preConfirm: () => {
                const streetName = document.getElementById('street-name').value;
                const purok = document.getElementById('purok').value;
                if (!streetName || !purok) {
                    Swal.showValidationMessage("Both fields are required!");
                    return false;
                }
                return { streetName, purok };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { streetName, purok } = result.value;
    
                httpClient.post('/api/partial_admin/brgystreets', {
                    req_brgy_street_name: streetName,
                    req_brgy_street_purok: purok,
                })
                    .then((data) => {
                        Swal.fire("Success!", data.message, "success");
                        setRefreshLocations((prev) => !prev);
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message || "Failed to add street", "error");
                    });
            }
        });
    };
    

    // Handle Edit Village
    const handleEditVillage = (id, name) => {
        Swal.fire({
            title: "Edit Village",
            input: "text",
            inputValue: name,
            showCancelButton: true,
            confirmButtonText: "Save",
        }).then((result) => {
            if (result.isConfirmed) {
                httpClient.put('/api/partial_admin/villages', {
                    req_village_id: id,
                    req_village_name: result.value,
                })
                    .then((data) => {
                        Swal.fire("Updated!", data.message, "success");
                        setRefreshLocations((prev) => {
                            return !prev;
                        });
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message || "Failed to edit village", "error");
                    });
            }
        });
    };
    // Handle Edit Street
    const handleEditStreet = (id, name, purok) => {
        Swal.fire({
            title: "Edit Street",
            html: `
                <input id="swal-input-street" class="swal2-input" placeholder="Street Name" value="${name}">
                <input id="swal-input-purok" class="swal2-input" placeholder="Purok" value="${purok}">
            `,
            showCancelButton: true,
            confirmButtonText: "Save",
            preConfirm: () => {
                const streetName = document.getElementById("swal-input-street").value;
                const purokName = document.getElementById("swal-input-purok").value;

                if (!streetName || !purokName) {
                    Swal.showValidationMessage("Both fields are required!");
                }
                return { streetName, purokName };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                httpClient.put('/api/partial_admin/brgystreets', {
                    req_brgy_street_id: id,
                    req_brgy_street_name: result.value.streetName,
                    req_brgy_street_purok: result.value.purokName,
                })
                    .then((data) => {
                        Swal.fire("Updated!", data.message, "success");
                        setRefreshLocations((prev) => !prev);
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message || "Failed to edit street", "error");
                    });
            }
        });
    };


    // Handle Delete Village
    const handleDeleteVillage = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                httpClient.delete(`/api/partial_admin/villages?req_village_id=${id}`)
                    .then((data) => {
                        Swal.fire("Deleted!", data.message, "success");
                        setRefreshLocations((prev) => {
                            return !prev;
                        });
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message || "Failed to delete village", "error");
                    });
            }
        });
    };

    // Handle Delete Street
    const handleDeleteStreet = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                httpClient.delete(`/api/partial_admin/brgystreets?req_brgy_street_id=${id}`)
                    .then((data) => {
                        Swal.fire("Deleted!", data.message, "success");
                        setRefreshLocations((prev) => {
                            return !prev;
                        });
                    })
                    .catch((error) => {
                        Swal.fire("Error!", error.message || "Failed to delete street", "error");
                    });
            }
        });
    };


    // Table Columns for Villages
    const villageColumns = [
        { name: "ID", selector: (row) => row.id, sortable: true },
        { name: "Village Name", selector: (row) => row.village_name, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button onClick={() => handleEditVillage(row.id, row.village_name)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDeleteVillage(row.id)} className="text-red-500">Delete</button>
                </>
            ),
        },
    ];

    // Table Columns for Streets
    const streetColumns = [
        { name: "ID", selector: (row) => row.id, sortable: true },
        { name: "Street Name", selector: (row) => row.street_name, sortable: true },
        { name: "Purok", selector: (row) => row.purok, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button onClick={() => handleEditStreet(row.id, row.street_name, row.purok)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDeleteStreet(row.id)} className="text-red-500">Delete</button>
                </>
            ),
        },
    ];

    return (
        <div className="p-4">
            {/* Tabs */}
            <div className="flex gap-4 mb-4">
                <button className={`p-2 rounded ${activeTab === "villages" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("villages")}>Manage Villages</button>
                <button className={`p-2 rounded ${activeTab === "streets" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("streets")}>Manage Streets</button>
            </div>
            {/* Add Button */}
            <button onClick={activeTab === "villages" ? handleAddVillage : handleAddStreet} className="bg-green-500 text-white p-2 rounded mb-4">Add {activeTab === "villages" ? "Village" : "Street"}</button>
            {/* DataTable */}
            {activeTab === "villages" && <DataTable title="Villages List" columns={villageColumns} data={allVillagesData || []} pagination highlightOnHover />}
            {activeTab === "streets" && <DataTable title="Streets List" columns={streetColumns} data={allBrgyStreetsData || []} pagination highlightOnHover />}
        </div>
    );
}

export default ManageStreetsAndVillage;
