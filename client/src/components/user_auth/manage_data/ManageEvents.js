import { useState } from "react";
import FetchData from "../FetchFunction";
import { getReadableDate, getReadableTime } from "./functions";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreateEventModal from "../modals/post/CreateEventModal";
import EditEventModal from "../modals/put/EditEventModals";

function ManageEvents() {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [clickedEventInfo, setClickedEventInfo] = useState({});
    const [eventInfoLoading, setEventInfoLoading] = useState(false);
    const [showEventInfo, setShowEventInfo] = useState(false);
    const [refreshEvents, setRefreshEvents] = useState(0);

    const [activeView, setActiveView] = useState("create");

    const handleViewToggle = (view) => {
        setActiveView(view);
        setIsEventModalOpen((prevState) => !prevState);
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
            setRefreshEvents((prev) => {
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

    const handleEventInRowClick = async (e, event_id) => {
        e.preventDefault();
        setEventInfoLoading(true);
    
        const clickedEvent = allEventsData.find((event) => event.event_id === event_id);
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
            return !prev; // Toggle state
        });
    };
    

    return (
        <div id="manage-events" className="flex manage-data">
            
            <div className="flex-col">
                {/* Tab Controls */}
                <div className="btn-group">
                    <button
                        onClick={() => handleViewToggle("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Create Event
                    </button>
                    <button
                        onClick={() => handleViewToggle("manage")}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Manage Events
                    </button>

                </div>
    
                {/* Conditional Views */}
                {activeView === "create" && (
                    <div className="events-create">
                            <CreateEventModal
                                isOpen={true}
                                setRefreshEvents={setRefreshEvents}
                            />
                    </div>
                )}
    
                {activeView === "manage" && (
                    <div className="events-manage">
                        <div className="table-con">
                            <table className="table table-bordered table-hover table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Event I.D.</th>
                                        <th scope="col">Event Title</th>
                                        <th scope="col">Created By</th>
                                        <th scope="col">User Type</th>
                                        <th scope="col">Date Created</th>
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
                                                <td>{event.user_lastname}, {event.user_firstname} {event.user_middlename}</td>
                                                <td>{event.user_resident_type}</td>
                                                <td>{event.event_date_created}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            
            {isEventModalOpen && (
                /* Event Info Section */
                <div className="event-info">
                    {!showEventInfo ? (
                        <h3>Select Event</h3>
                    ) : eventInfoLoading ? (
                        <h3>Loading...</h3>
                    ) : (
                        <>
                            <h3>{clickedEventInfo.event_title}</h3>
                            <h4>{clickedEventInfo.event_description}</h4>
                            <h4>{getReadableDate(clickedEventInfo.event_date)}</h4>
                            <h4>{getReadableTime(clickedEventInfo.event_start_time)}</h4>
                            <h4>{getReadableTime(clickedEventInfo.event_end_time)}</h4>
                            <h5>{clickedEventInfo.user_lastname}, {clickedEventInfo.user_firstname} {clickedEventInfo.user_middlename}</h5>
                            <button onClick={handleDeleteEvent} data-value={clickedEventInfo.event_id}>
                                Delete Event
                            </button>
                            <button onClick={() => EditEventModal(clickedEventInfo, setRefreshEvents, setClickedEventInfo)}>
                                Edit Event
                            </button>
        
                            {/* {isEditModalOpen && (
                                <EditEventModal 
                                    eventData={clickedEventInfo}
                                    setRefreshEvents={setRefreshEvents}
                                    setClickedEventInfo={setClickedEventInfo}
                                />
                            )} */}
                        </>
                    )}
                </div>
            )}
            
        </div>
    );
    
}

export default ManageEvents;