import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";

const EditEventModal = (eventData, setRefreshEvents, setClickedEventInfo) => {
    console.log("events data", eventData);
    Swal.fire({
        title: "Edit Event",
        html: `
            <input id="swal-event-title" class="swal2-input" placeholder="Title" value="${eventData.event_title || ""}">
            <input id="swal-event-location" class="swal2-input" placeholder="Location" value="${eventData.event_location || ""}">
            <textarea id="swal-event-description" class="swal2-textarea" placeholder="Description">${eventData.event_description || ""}</textarea>
            <input type="date" id="swal-event-date" class="swal2-input" value="${eventData.event_date || ""}">
            <input type="time" id="swal-event-start-time" class="swal2-input" value="${eventData.event_start_time || ""}">
            <input type="time" id="swal-event-end-time" class="swal2-input" value="${eventData.event_end_time || ""}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update Event",
        preConfirm: async () => {
            const updatedEvent = {
                req_event_id: eventData.event_id,
                req_event_title: document.getElementById("swal-event-title").value,
                req_event_location: document.getElementById("swal-event-location").value,
                req_event_description: document.getElementById("swal-event-description").value,
                req_event_date: document.getElementById("swal-event-date").value,
                req_event_start_time: document.getElementById("swal-event-start-time").value,
                req_event_end_time: document.getElementById("swal-event-end-time").value,
            };

            try {
                const response = await httpClient.put("/api/partial_admin/events", updatedEvent);
                if (response.status !== 200) {
                    throw new Error("Bad request");
                }

                Swal.fire("Updated!", "The event has been updated.", "success");
                setRefreshEvents((prev) => !prev);
                setClickedEventInfo(updatedEvent);
            } catch (error) {
                Swal.fire("Error!", "Failed to update event.", "error");
                console.error("Error updating event:", error);
            }
        },
    });
};

export default EditEventModal;
