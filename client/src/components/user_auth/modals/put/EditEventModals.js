import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";

let min = new Date().toISOString().split("T")[0];

const EditEventModal = (eventData, setRefreshEvents, setClickedEventInfo) => {
    Swal.fire({
        title: "Edit Event",
        html: `
            <input id="swal-event-title" class="swal2-input" placeholder="Title" value="${eventData.event_title || ""}">
            <input id="swal-event-location" class="swal2-input" placeholder="Location" value="${eventData.event_location || ""}">
            <textarea id="swal-event-description" class="swal2-textarea" placeholder="Description">${eventData.event_description || ""}</textarea>
            <input type="date" id="swal-event-date" class="swal2-input" value="${eventData.event_date || ""} ">
            <input type="time" id="swal-event-start-time" class="swal2-input" value="${eventData.event_start_time?.slice(0,5) || ""}">
            <input type="time" id="swal-event-end-time" class="swal2-input" value="${eventData.event_end_time?.slice(0,5) || ""}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update Event",
        preConfirm: async () => {
            // Compare new input values with original eventData.
            const newTitle = document.getElementById("swal-event-title").value.trim();
            const newLocation = document.getElementById("swal-event-location").value.trim();
            const newDescription = document.getElementById("swal-event-description").value.trim();
            const newDate = document.getElementById("swal-event-date").value;
            const newStartTime = document.getElementById("swal-event-start-time").value?.slice(0,5);
            const newEndTime = document.getElementById("swal-event-end-time").value?.slice(0,5);
            
            const updatedEvent = {
                req_event_id: eventData.event_id,
                req_event_title: newTitle === eventData.event_title ? null : newTitle,
                req_event_location: newLocation === eventData.event_location ? null : newLocation,
                req_event_description: newDescription === eventData.event_description ? null : newDescription,
                req_event_date: newDate === eventData.event_date ? null : newDate,
                req_event_start_time: newStartTime,
                req_event_end_time: newEndTime,
            };

            try {
                document.body.style.cursor = 'wait';
                const response = await httpClient.put("/api/partial_admin/events", updatedEvent);

                if (response.status !== 200) {
                    throw new Error("Bad request");
                }

                Swal.fire("Updated!", "The event has been updated.", "success");
                setRefreshEvents((prev) => !prev);
                setClickedEventInfo(updatedEvent);
            } catch (error) {
                let errorMessage = "Something went wrong.";
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.request) {
                    errorMessage = "Network Error. Please try again.";
                } else {
                    errorMessage = error.message;
                }
                Swal.fire("Error!", errorMessage, "error");
            } finally {
                document.body.style.cursor = 'default';
            }
        },
    });
};

export default EditEventModal;
