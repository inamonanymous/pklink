import { useState } from "react";
import FetchData from "../FetchFunction";
import { getReadableDate, getReadableTime } from "./functions";
import httpClient from "../../../httpClient";


function ManageEvents() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedEventInfo, setClickedEventInfo] = useState({});
    const [eventInfoLoading, setEventInfoLoading] = useState(false);
    const [showEventInfo, setShowEventInfo] = useState(false);
    const [refreshEvents, setRefreshEvents] = useState(0);
    const handleModalToggle = () => {
        setIsModalOpen((prevState) => !prevState);
    };
    const {data: allEventsData, error, loading} = FetchData("/api/user/events", refreshEvents);

    

      const handleDeleteEvent = async (e) => {
            e.preventDefault();
            const confirmDialogue = window.confirm("Do you want to continue deleting this event?");
            if (!confirmDialogue) {
                return;
            }
            try {
                const id = e.currentTarget.getAttribute('data-value');
                const  resp = await httpClient.delete('/api/partial_admin/events', {
                    params: { req_event_id: id }
                });
                console.log("Before state update");
                setRefreshEvents((prev) => {
                    console.log("Inside state update, prev:", prev); // Check if this runs
                    return !prev;
                });
                setShowEventInfo(false);
                alert('event deleted');
                  
            } catch (error) {
                if (error.status === 406){
                    console.error(error);
                    alert('current user is not allowed');
                    return;
                }
                if (error.status === 404){
                    console.error(error);
                    alert('target event is not found');
                    return;
                }
                if (error.status === 400){
                    console.error(error);
                    alert('invalid request');
                    return;
                }
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
                const resp = await httpClient.post('/api/partial_admin/events', eventsData);
                if (resp.status === 400) {
                    alert('Bad Request');
                    return;
                }
                
                if (resp.status === 404) {
                    alert('No User Found');
                    return;
                }
            
                alert('Event added');
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
                alert('Error adding event');
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
        <div id="manage-events" className="flex">
            <div id="events-controls" >
                <button
                    onClick={handleModalToggle}
                    >
                    Create New Event
                    </button>
                {isModalOpen && (
                    <form onSubmit={handleSubmit}>
                        <div className="flex-col">
                            <input 
                                type="text" 
                                name="req_event_title"
                                value={eventsData.req_event_title}
                                onChange={handleInputChange}
                                placeholder="Title"
                            />
                            <input 
                                type="text" 
                                name="req_event_location"
                                value={eventsData.req_event_location}
                                onChange={handleInputChange}
                                placeholder="Location"
                            />
                            <textarea 
                                cols="30" 
                                rows="10" 
                                name="req_event_description"
                                value={eventsData.req_event_description}
                                onChange={handleInputChange}
                                placeholder="Description"
                            >
                            </textarea>
                            <input 
                                type="date" 
                                name="req_event_date"
                                value={eventsData.req_event_date}
                                onChange={handleInputChange}
                                placeholder="Event date"
                            />
                            <input 
                                type="time" 
                                name="req_event_start_time"
                                value={eventsData.req_event_start_time}
                                onChange={handleInputChange}
                                placeholder="Start time"
                            />
                            <input 
                                type="time" 
                                name="req_event_end_time"
                                value={eventsData.req_event_end_time}
                                onChange={handleInputChange}
                                placeholder="Snd time"
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                )}
                <div className="table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Event I.D.</th>
                                <th>Event title</th>
                                <th>Created by</th>
                                <th>User type</th>
                                <th>Date created</th>
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
                        <button>Edit Event</button>
                    </>
                )}
                
            </div>
        </div>
    );
}

export default ManageEvents;