import React, { useState } from "react";
import httpClient from "../../../httpClient"; // Assuming you already have an httpClient set up
import Swal from "sweetalert2";

function HealthAssist() {
    const [healthSupportData, setHealthSupportData] = useState({
        req_support_type: '',
        req_additional_info: '',
        req_description: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHealthSupportData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const resp = await httpClient.post('/api/user/health_support_requests', healthSupportData);
            if (resp.status === 201) {
                setMessage('Health support request successfully submitted.');
                setHealthSupportData({
                    req_support_type: '',
                    req_additional_info: '',
                    req_description: '',
                });
                Swal.fire({
                    title: 'Success!',
                    text: 'Your health assistance request has been successfully submitted.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error(error);
            setMessage('Error submitting health support request.');
            Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Try Again'
                        });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="health-assist-con" className="flex-col">
            <div className="text-con head">
                <h4>Request Health Assistance</h4>
            </div>
            <div className="form-con">
                <form onSubmit={handleSubmit} className="user-side-forms flex-col">
                    <div className="input-con flex-col">
                        <label>Support Type</label>
                        <input
                            type="text"
                            name="req_support_type"
                            placeholder="Enter the support type"
                            value={healthSupportData.req_support_type}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-con flex-col">
                        <label>Additional Info</label>
                        <textarea
                            name="req_additional_info"
                            placeholder="Enter any additional information"
                            value={healthSupportData.req_additional_info}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>
                    <div className="input-con flex-col">
                        <label>Description</label>
                        <textarea
                            name="req_description"
                            placeholder="Enter a description of your health support request"
                            value={healthSupportData.req_description}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default HealthAssist;
