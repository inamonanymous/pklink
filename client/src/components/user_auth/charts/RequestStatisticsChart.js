import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import httpClient from "../../../httpClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatDate = (dateString, timeSpan) => {
    const date = new Date(dateString);
    if (timeSpan === "daily_counts") {
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } else if (timeSpan === "monthly_counts") {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (timeSpan === "yearly_counts") {
        return date.getFullYear().toString();
    }
    return dateString;
};

const RequestStatisticsChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [timeSpan, setTimeSpan] = useState("daily_counts");

    useEffect(() => {
        httpClient.get(`/api/admin/requests-stats?span=${timeSpan}`)
            .then((response) => {
                const data = response.data.data || response.data; // Ensure correct data structure
                if (!data) {
                    console.warn("No data available for the selected time span.");
                    return;
                }
                
                const labels = Object.keys(data[timeSpan] || {}).map(date => formatDate(date, timeSpan));
                const counts = Object.values(data[timeSpan] || {});
                const healthSupportCounts = Object.values(data.health_support_counts || {});
                const documentCounts = Object.values(data.document_counts || {});

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Total Requests",
                            data: counts,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                        },
                        {
                            label: "Health Support Requests",
                            data: healthSupportCounts,
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                        {
                            label: "Document Requests",
                            data: documentCounts,
                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                        },
                    ],
                });
            })
            .catch((error) => {
                console.error("Error fetching request statistics:", error);
            });
    }, [timeSpan]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Request Statistics</h2>
            <div className="flex gap-4 mb-4">
                {["daily_counts", "monthly_counts", "yearly_counts"].map((span) => (
                    <button
                        key={span}
                        className={`p-2 rounded ${timeSpan === span ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTimeSpan(span)}
                    >
                        {span.replace("_counts", "").charAt(0).toUpperCase() + span.replace("_counts", "").slice(1)}
                    </button>
                ))}
            </div>
            {/* Fixed Height and Overflow Prevention */}
            <div className="w-full h-[400px] overflow-hidden">
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        </div>
    );
};

export default RequestStatisticsChart;
