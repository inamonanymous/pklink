import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import httpClient from "../../../httpClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsersByResidentTypeChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        httpClient.get("/api/admin/residenttype-stats")
            .then((response) => {
                const data = response.data.data || response.data; // Ensure correct data structure
                if (data.labels.length === 0 || data.counts.length === 0) {
                    console.warn("No data available for the selected time span.");
                    return;
                }
                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: "Users by Resident Type",
                            data: data.counts,
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                    ],
                });
            })
            .catch((error) => {
                console.error("Error fetching users by resident type:", error);
            });
    }, []);

    return (
        <div className="w-full h-[1000px] overflow-hidden">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
    );
};

export default UsersByResidentTypeChart;
