import { useState } from "react";
import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";

const CreateEventModal = ({ isOpen, setRefreshEvents }) => {
    // Hooks must be at the top level, before any conditional statements
    const [eventsData, setEventsData] = useState({
        req_event_title: '',
        req_event_description: '',
        req_event_date: '',
        req_event_start_time: '',
        req_event_end_time: '',
        req_event_location: ''
    });

    if (!isOpen) return null; // This should come AFTER hooks

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventsData((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            document.body.style.cursor = 'wait';
            const resp = await httpClient.post('/api/partial_admin/events', eventsData);
            if (resp.status === 400) {
                Swal.fire('Error!', 'Bad request.', 'error');
                return;
            }

            if (resp.status === 404) {
                Swal.fire('Failed!', 'The event failed to add.', 'failed');
                return;
            }

            Swal.fire('Added!', 'The event has been added.', 'success');
            setEventsData({
                req_event_title: '',
                req_event_description: '',
                req_event_date: '',
                req_event_start_time: '',
                req_event_end_time: '',
                req_event_location: '',
            });
            setRefreshEvents(prev => !prev);
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', `${error.response.data.message}`, 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    return (
        <div className="events-create"> 
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column">
                    <div className="mb-3">
                        <input
                            type="text"
                            name="req_event_title"
                            value={eventsData.req_event_title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="req_event_location"
                            value={eventsData.req_event_location}
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
                            value={eventsData.req_event_description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <input
                            type="date"
                            name="req_event_date"
                            value={eventsData.req_event_date}
                            onChange={handleInputChange}
                            placeholder="Event date"
                            min={new Date().toISOString().split("T")[0]}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="time"
                            name="req_event_start_time"
                            value={eventsData.req_event_start_time}
                            onChange={handleInputChange}
                            placeholder="Start time"
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="time"
                            name="req_event_end_time"
                            value={eventsData.req_event_end_time}
                            onChange={handleInputChange}
                            placeholder="End time"
                            className="form-control"
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEventModal;
