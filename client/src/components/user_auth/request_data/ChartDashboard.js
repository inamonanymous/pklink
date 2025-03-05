import { useState } from "react";
import UserRegistrationChart from "../charts/UserRegistrationChart";
import UsersByResidentTypeChart from "../charts/UsersByResidentTypeChart";
import RequestsStatisticsChart from "../charts/RequestStatisticsChart";

function ChartDashboard() {
    const [activeChart, setActiveChart] = useState("userRegistration");

    const renderChart = () => {
        switch (activeChart) {
            case "userRegistration":
                return <UserRegistrationChart />;
            case "userResidentType":
                return <UsersByResidentTypeChart />;
            case "requestsStatistics":
                return <RequestsStatisticsChart />;
            default:
                return <p>Select a chart to view</p>;
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Data Visualization Dashboard</h2>
            <div className="flex gap-4 mb-4">
                <button 
                    className={`p-2 rounded ${activeChart === "userRegistration" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveChart("userRegistration")}
                >
                    User Registration
                </button>
                <button 
                    className={`p-2 rounded ${activeChart === "userResidentType" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveChart("userResidentType")}
                >
                    Resident Types
                </button>
                <button 
                    className={`p-2 rounded ${activeChart === "requestsStatistics" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveChart("requestsStatistics")}
                >
                    Requests Statistics
                </button>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
                {renderChart()}
            </div>
        </div>
    );
}

export default ChartDashboard;
