import { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import { getReadableDate, getReadableTime } from "./functions";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreateEventModal from "../modals/post/CreateEventModal";
import EditEventModal from "../modals/put/EditEventModals";

function ManageEvents() {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [activeView, setActiveView] = useState("create");
    const [clickedEventInfo, setClickedEventInfo] = useState({});
    const [showEventInfo, setShowEventInfo] = useState(false);
    const [refreshEvents, setRefreshEvents] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const handleViewToggle = (view) => {
        setActiveView(view);
        setIsEventModalOpen((prev) => !prev);
    };

    const { data: allEventsData, error, loading } = FetchData("/api/user/events", refreshEvents);

    const handleDeleteEvent = async (id) => {
        const confirmDialogue = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to continue deleting this event?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (!confirmDialogue.isConfirmed) return;

        try {
            document.body.style.cursor = 'wait';
            await httpClient.delete('/api/partial_admin/events', { params: { req_event_id: id } });
            setRefreshEvents(prev => !prev);
            setShowEventInfo(false);
            Swal.fire('Deleted!', 'The event has been deleted.', 'success');
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete event.', 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleEventInRowClick = (event) => {
        setClickedEventInfo(event);
        setShowEventInfo(true);
    };

    // Filter events based on search term
    const filteredEvents = allEventsData?.filter(event =>
        event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.user_lastname.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const columns = [
        { name: "Event ID", selector: row => row.event_id, sortable: true },
        { name: "Event Title", selector: row => row.event_title, sortable: true },
        { name: "Created By", selector: row => `${row.user_lastname}, ${row.user_firstname} ${row.user_middlename}`, sortable: true },
        { name: "User Type", selector: row => row.user_resident_type, sortable: true },
        { name: "Date Created", selector: row => row.event_date_created, sortable: true },
        {
            name: "Actions",
            cell: row => (
                <button className="btn btn-danger" onClick={() => handleDeleteEvent(row.event_id)}>
                    Delete
                </button>
            ),
        },
    ];

    return (
        <div id="manage-events" className="flex manage-data">
            <div className="flex-col">
                <div className="btn-group">
                    <button onClick={() => handleViewToggle("create")} className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}>Create Event</button>
                    <button onClick={() => handleViewToggle("manage")} className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}>Manage Events</button>
                </div>

                {activeView === "create" && <CreateEventModal isOpen={true} setRefreshEvents={setRefreshEvents} />}

                {activeView === "manage" && (
                    <div className="events-manage">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DataTable
                            title="Events List"
                            columns={columns}
                            data={filteredEvents}
                            pagination
                            highlightOnHover
                            onRowClicked={handleEventInRowClick}
                        />
                    </div>
                )}
            </div>

            {isEventModalOpen && (
                <div className="event-info">
                    {!showEventInfo ? (
                        <h3>Select Event</h3>
                    ) : (
                        <>
                            <h3>{clickedEventInfo.event_title}</h3>
                            <h4>{clickedEventInfo.event_description}</h4>
                            <h4>{getReadableDate(clickedEventInfo.event_date)}</h4>
                            <h4>{getReadableTime(clickedEventInfo.event_start_time)}</h4>
                            <h4>{getReadableTime(clickedEventInfo.event_end_time)}</h4>
                            <h5>{clickedEventInfo.user_lastname}, {clickedEventInfo.user_firstname} {clickedEventInfo.user_middlename}</h5>
                            <button onClick={() => handleDeleteEvent(clickedEventInfo.event_id)}>Delete Event</button>
                            <button onClick={() => EditEventModal(clickedEventInfo, setRefreshEvents, setClickedEventInfo)}>Edit Event</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ManageEvents;
