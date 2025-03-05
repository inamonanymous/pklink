import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import httpClient from "../../../httpClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatDate = (dateString, timeSpan) => {
    const date = new Date(dateString);
    if (timeSpan === "daily") {
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } else if (timeSpan === "monthly") {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (timeSpan === "yearly") {
        return date.getFullYear().toString();
    }
    return dateString;
};

const UserRegistrationChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [timeSpan, setTimeSpan] = useState("daily");

    useEffect(() => {
        httpClient.get(`/api/admin/registration-stats?span=${timeSpan}`)
            .then((response) => {
                const data = response.data.data || response.data;
                if (!data.labels.length || !data.counts.length) {
                    console.warn("No data available for the selected time span.");
                    return;
                }

                const lastNames = data.last_names || [];
                const uniqueLastNames = [...new Set(lastNames.flat())];
                
                const datasets = uniqueLastNames.map((lastName, idx) => {
                    return {
                        label: `Last Name: ${lastName}`,
                        data: data.labels.map((_, index) => lastNames[index]?.filter(name => name === lastName).length || 0),
                        backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                    };
                });

                setChartData({
                    labels: data.labels.map(date => formatDate(date, timeSpan)),
                    datasets
                });
            })
            .catch((error) => {
                console.error("Error fetching registration data:", error);
            });
    }, [timeSpan]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">User Registration Timeline</h2>
            <div className="flex gap-4 mb-4">
                {["daily", "monthly", "yearly"].map((span) => (
                    <button
                        key={span}
                        className={`p-2 rounded ${timeSpan === span ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTimeSpan(span)}
                    >
                        {span.charAt(0).toUpperCase() + span.slice(1)}
                    </button>
                ))}
            </div>
            {/* Fixed Height and Overflow Prevention */}
            <div className="w-full h-[400px] overflow-hidden">
                <Bar 
                    data={chartData} 
                    options={{
                        responsive: true, 
                        maintainAspectRatio: false
                    }} 
                />
            </div>
        </div>
    );
};

export default UserRegistrationChart;
