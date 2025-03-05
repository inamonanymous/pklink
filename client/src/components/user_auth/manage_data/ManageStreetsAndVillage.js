import { useState } from "react";
import FetchData from "../FetchFunction";
import DataTable from "react-data-table-component";

function ManageStreetsAndVillage({ refreshRequests }) {
    const [activeTab, setActiveTab] = useState("villages");

    // Fetch Data
    const { data: allBrgyStreetsData, error: streetsError, loading: streetsLoading } = FetchData("/api/user/brgystreets", refreshRequests);
    const { data: allVillagesData, error: villagesError, loading: villagesLoading } = FetchData("/api/user/villages", refreshRequests);

    // Table Columns
    const villageColumns = [
        { name: "ID", selector: (row) => row.id, sortable: true },
        { name: "Village Name", selector: (row) => row.village_name, sortable: true },
        { name: "Last Modified", selector: (row) => row.last_modified, sortable: true },
        { name: "Modified By", selector: (row) => row.modified_by, sortable: true },
    ];

    const streetColumns = [
        { name: "ID", selector: (row) => row.id, sortable: true },
        { name: "Street Name", selector: (row) => row.street_name, sortable: true },
        { name: "Last Modified", selector: (row) => row.last_modified, sortable: true },
        { name: "Modified By", selector: (row) => row.modified_by, sortable: true },
    ];

    return (
        <div className="p-4">
            {/* Tabs for switching between Manage Villages & Manage Streets */}
            <div className="flex gap-4 mb-4">
                <button
                    className={`p-2 rounded ${activeTab === "villages" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("villages")}
                >
                    Manage Villages
                </button>
                <button
                    className={`p-2 rounded ${activeTab === "streets" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("streets")}
                >
                    Manage Streets
                </button>
            </div>

            {/* Loading & Error Handling */}
            {/* {(streetsLoading || villagesLoading) && <p>Loading...</p>}
            {streetsError && <p>Error loading streets: {streetsError}</p>}
            {villagesError && <p>Error loading villages: {villagesError}</p>} */}

            {/* Data Table */}
            {activeTab === "villages" && (
                <DataTable
                    title="Villages List"
                    columns={villageColumns}
                    data={allVillagesData || []}
                    pagination
                    highlightOnHover
                />
            )}

            {activeTab === "streets" && (
                <DataTable
                    title="Streets List"
                    columns={streetColumns}
                    data={allBrgyStreetsData || []}
                    pagination
                    highlightOnHover
                />
            )}
        </div>
    );
}

export default ManageStreetsAndVillage;
