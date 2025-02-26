import { useState, useEffect } from "react";
import httpClient from "../../../../httpClient";
import Swal from "sweetalert2";

const EditEventModal = ({ isOpen, onClose, eventData, setRefreshEvents }) => {
    
    const [eventDetails, setEventDetails] = useState({
        req_event_id: eventData.event_id,
        req_event_title: eventData.req_event_title || "",
        req_event_description: eventData.req_event_description || "",
        req_event_date: eventData.req_event_date || "",
        req_event_start_time: eventData.req_event_start_time || "",
        req_event_end_time: eventData.req_event_end_time || "",
        req_event_location: eventData.req_event_location || ""
    });

    useEffect(() => {
        setEventDetails({
            req_event_id: eventData.event_id,
            req_event_title: eventData.event_title,
            req_event_description: eventData.event_description,
            req_event_date: eventData.event_date,
            req_event_start_time: eventData.event_start_time,
            req_event_end_time: eventData.event_end_time,
            req_event_location: eventData.event_location
        });
        console.log(eventDetails);
        console.log(eventDetails.req_event_title);
        console.log(eventDetails.event_title);
    }, [eventData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            document.body.style.cursor = "wait";
            const response = await httpClient.put("/api/partial_admin/events", eventDetails);
            if (!response.status === 200) {
                Swal.fire("Error!", "Bad request.", "error");
            }
            
            Swal.fire("Updated!", "The event has been updated.", "success");
            setRefreshEvents(prev => !prev); // Refresh event list
            isOpen(false);
        } catch (error) {
            if (error.status === 400) {

                Swal.fire("Error!", "Bad request.", "error");
                return;
            }
            console.error("Error updating event:", error);
            Swal.fire("Error!", "Failed to update event.", "error");
        } finally {
            document.body.style.cursor = "default";
        }
    };

    if (!isOpen || !eventData) return null;

    return (
        <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column">
                <div className="mb-3">
                    <input
                        type="text"
                        name="req_event_title"
                        value={eventDetails.req_event_title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="req_event_location"
                        value={eventDetails.req_event_location}
                        onChange={handleInputChange}
                        placeholder="Location"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        cols="30"
                        rows="10"
                        name="req_event_description"
                        value={eventDetails.req_event_description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="form-control"
                    ></textarea>
                </div>
                <div className="mb-3">
                    <input
                        type="date"
                        name="req_event_date"
                        value={eventDetails.req_event_date}
                        onChange={handleInputChange}
                        placeholder="Event date"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="time"
                        name="req_event_start_time"
                        value={eventDetails.req_event_start_time}
                        onChange={handleInputChange}
                        placeholder="Start time"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="time"
                        name="req_event_end_time"
                        value={eventDetails.req_event_end_time}
                        onChange={handleInputChange}
                        placeholder="End time"
                        className="form-control"
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                        Update Event
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => { isOpen(false); }}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditEventModal;
