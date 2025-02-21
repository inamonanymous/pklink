import { useState } from "react";
import FetchData from "../FetchFunction";
import { getReadableDate, getReadableTime } from "./functions";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";

function ManageEvents() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedEventInfo, setClickedEventInfo] = useState({});
    const [eventInfoLoading, setEventInfoLoading] = useState(false);
    const [showEventInfo, setShowEventInfo] = useState(false);
    const [refreshEvents, setRefreshEvents] = useState(0);
    const handleModalToggle = () => {
        setIsModalOpen((prevState) => !prevState);
    };

    const handleEditEvent = (event) => {
        setClickedEventInfo(event); // Store the clicked event details
        setIsEditModalOpen(true); // Open the modal
    };

    const {data: allEventsData, error, loading} = FetchData("/api/user/events", refreshEvents);

    const handleDeleteEvent = async (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-value');
        const confirmDialogue = await Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to continue deleting this event?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel',
                });
        if (!confirmDialogue.isConfirmed) {
            console.log(true);
            return;
        }
        try {
            document.body.style.cursor = 'wait';
            await httpClient.delete('/api/partial_admin/events', {
                params: { req_event_id: id }
            });
            console.log("Before state update");
            setRefreshEvents((prev) => {
                console.log("Inside state update, prev:", prev); // Check if this runs
                return !prev;
            });
            setShowEventInfo(false);
            Swal.fire('Deleted!', 'The event has been deleted.', 'success');
                
        } catch (error) {
            if (error.status === 406){
                console.error(error);
                Swal.fire('Failed!', 'Current user not allowed to delete.', 'failed');
                return;
            }
            if (error.status === 404){
                console.error(error);
                Swal.fire('Failed!', 'The target event not found.', 'failed');
                return;
            }
            if (error.status === 400){
                console.error(error);
                Swal.fire('Error!', 'Bad request', 'error');
                return;
            }
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    const [eventsData, setEventsData] = useState({
        'req_event_title': '',
        'req_event_description': '',
        'req_event_date': '',
        'req_event_start_time': '',
        'req_event_end_time': '',
        'req_event_location': ''
    });
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
                    Swal.fire('Errpr!', 'Bad request.', 'error');
                    return;
                }
                
                if (resp.status === 404) {
                    Swal.fire('Failed!', 'The event is failed to add.', 'failed');
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
                setIsModalOpen(false);
                setRefreshEvents((prev) => {
                    console.log("Previous state:", prev);
                    return !prev; // Toggle state
                  });
                
            } catch (error) {
                console.log(eventsData);
                console.error(error);
                Swal.fire('Error!', 'Error adding event', 'error');
            } finally {
                document.body.style.cursor = 'default';
            }
    
        }
    

    const handleEventInRowClick = async (e, event_id) => {
        e.preventDefault();
        setEventInfoLoading(true);
    
        const clickedEvent = allEventsData.find((event) => event.event_id === event_id);
        console.log(event_id);
        if (!clickedEvent) {
            console.error("event not found");
            setEventInfoLoading(false);
            return;
        }
    
        // Directly set clickedeventInfo and showeventInfo
        setClickedEventInfo(clickedEvent);
        setEventInfoLoading(false);
        setShowEventInfo(true);
        setRefreshEvents((prev) => {
            console.log("Previous state:", prev);
            return !prev; // Toggle state
        });
    };
    

    return (
        <div id="manage-events" className="flex manage-data">
            <div id="events-controls" >
                <button
                    onClick={handleModalToggle}
                    className="btn btn-success"
                    >
                    Create New Event
                    </button>
                {isModalOpen && (
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
                        <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                )}
                <div className="table-con">
                    <table className="table table-bordered table-hover table-stripped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Event I.D.</th>
                                <th scope="col">Event title</th>
                                <th scope="col">Created by</th>
                                <th scope="col">User type</th>
                                <th scope="col">Date created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allEventsData === null || allEventsData.length === 0 ? (
                                <>No events</>
                            ) : (
                                allEventsData.map((event) => (
                                    <tr 
                                        key={event.event_id}
                                        onClick={(e) => handleEventInRowClick(e, event.event_id)}
                                    >
                                        <td>{event.event_id}</td>
                                        <td>{event.event_title}</td>
                                        <td>
                                            {event.user_lastname}, {event.user_firstname}{" "}
                                            {event.user_middlename}
                                        </td>
                                        <td>{event.user_resident_type}</td>
                                        <td>{event.event_date_created}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="event-info">
                {!showEventInfo ? (
                    <>
                     <h3>Select Event</h3>
                    </>

                ) : eventInfoLoading ? (
                    <>
                        <h3>Loading...</h3>
                    </>
                ) : (
                    <>
                        <h3>{clickedEventInfo.event_title}</h3>
                        <h4>{clickedEventInfo.event_description}</h4>
                        <h4>{getReadableDate(clickedEventInfo.event_date)}</h4>
                        <h4>{getReadableTime(clickedEventInfo.event_start_time)}</h4>
                        <h4>{getReadableTime(clickedEventInfo.event_end_time)}</h4>
                        <h5>{clickedEventInfo.user_lastname}, {clickedEventInfo.user_firstname} {clickedEventInfo.user_middlename}</h5>
                        <button
                            onClick={handleDeleteEvent} 
                            data-value={clickedEventInfo.event_id}
                        >
                            Delete Event
                        </button>
                        <button onClick={() => handleEditEvent(event)}>Edit Event</button>
                    </>
                )}
                
            </div>
        </div>
    );
}

export default ManageEvents;

function ManageEventModal({ clickedEventInfo, isEditModalOpen, handleEditModalToggle, setRefreshEvents }) {
    const [updatedEventData, setUpdatedEventData] = useState(clickedEventInfo);

    useEffect(() => {
        setUpdatedEventData(clickedEventInfo);
    }, [clickedEventInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEventData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            document.body.style.cursor = 'wait';
            await httpClient.put(`/api/partial_admin/events/${clickedEventInfo.event_id}`, updatedEventData);
            Swal.fire('Updated!', 'The event has been updated.', 'success');
            setRefreshEvents((prev) => !prev);
            handleEditModalToggle();
        } catch (error) {
            Swal.fire('Error!', 'Failed to update event.', 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    return isEditModalOpen ? (
        <div className="modal">
            <form onSubmit={handleUpdateEvent}>
                <input type="text" name="event_title" value={updatedEventData.event_title || ''} onChange={handleInputChange} placeholder="Title" />
                <textarea name="event_description" value={updatedEventData.event_description || ''} onChange={handleInputChange} placeholder="Description" />
                <input type="date" name="event_date" value={updatedEventData.event_date || ''} onChange={handleInputChange} />
                <input type="time" name="event_start_time" value={updatedEventData.event_start_time || ''} onChange={handleInputChange} />
                <input type="time" name="event_end_time" value={updatedEventData.event_end_time || ''} onChange={handleInputChange} />
                <input type="text" name="event_location" value={updatedEventData.event_location || ''} onChange={handleInputChange} placeholder="Location" />
                <button type="submit">Update</button>
                <button type="button" onClick={handleEditModalToggle}>Cancel</button>
            </form>
        </div>
    ) : null;
}