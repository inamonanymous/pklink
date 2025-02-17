import React, { useState } from "react";
import Swal from "sweetalert2";
import httpClient from "../../../httpClient"; // Adjust according to your API setup

function ReportIncident() {
    const [incidentData, setIncidentData] = useState({
        description: '',
        location: '',
        photo: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIncidentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setIncidentData((prev) => ({
            ...prev,
            photo: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('req_description', incidentData.description);
        formData.append('req_location', incidentData.location);
        formData.append('req_incident_photo', incidentData.photo);

        try {
            document.body.style.cursor = 'wait';
            const response = await httpClient.post('/api/user/incidents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Incident Reported',
                    text: 'Your incident has been successfully reported.',
                });
                
                // Reset form
                setIncidentData({
                    description: '',
                    location: '',
                    photo: null,
                });
            } else {
                throw new Error('Something went wrong!');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to report the incident. Please try again.',
            });
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    return (
        <>
            <div id="report-incident-con" className="flex-col">
                <div className="text-con head">
                    <h4>Report Incident</h4>
                </div>
                <div className="form-con">
                    <form className="user-side-forms flex-col" onSubmit={handleSubmit}>
                        <div className="input-con flex-col">
                            <label>
                                Briefly Describe the Incident.
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your answer here"
                                name="description"
                                value={incidentData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-con flex-col">
                            <label>
                                Where did the incident Occur?
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your answer here"
                                name="location"
                                value={incidentData.location}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-con flex-col">
                            <label>
                                Provide a Photo Related to the Incident.
                            </label>
                            <input
                                type="file"
                                name="req_incident_photo"
                                required
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ReportIncident;
