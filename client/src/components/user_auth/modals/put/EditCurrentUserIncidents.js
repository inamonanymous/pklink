import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";


const EditCurrentUserIncident = (allUserIncidents, incident_id, setRefreshIncidents) => {
    const selectedIncident = allUserIncidents.find(incident => incident.incident_id === incident_id);

    if (!selectedIncident) {
        console.error("Error: Incident data not found.");
        return;
    }

    console.log("Editing Incident:", selectedIncident); // Debugging

    Swal.fire({
        title: "Edit Incident",
        html: `
            <div style="text-align: left; display: flex; flex-direction: column;">
                <label for="swal-description">Description</label>
                <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${selectedIncident?.description || ''}</textarea>

                <label for="swal-location">Location</label>
                <input id="swal-location" class="swal2-input" placeholder="Location" value="${selectedIncident?.location || ''}">

                <label for="swal-incident-photo">Incident Photo</label>
                <input type="file" id="swal-incident-photo" class="swal2-input">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Update Incident",
        preConfirm: async () => {
            const formData = new FormData();
            formData.append("req_description", document.getElementById("swal-description").value);
            formData.append("req_location", document.getElementById("swal-location").value);
            formData.append("req_incident_id", incident_id);

            const incidentPhotoInput = document.getElementById("swal-incident-photo");
            if (incidentPhotoInput.files.length > 0) {
                formData.append("req_incident_photo", incidentPhotoInput.files[0]);
            }

            console.log("Updated Incident:", Object.fromEntries(formData.entries())); // Debugging

            try {
                document.body.style.cursor = 'wait';
                const response = await httpClient.put("/api/user/incidents", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                if (response.status !== 200) {
                    throw new Error("Bad request");
                }

                Swal.fire("Updated!", "The incident has been updated.", "success");
                setRefreshIncidents(prev => !prev); // Refresh incident list
            } catch (error) {
                let errorMsg = "An unexpected error occurred.";
                if (error.response?.status === 408) errorMsg = "Invalid request.";
                if (error.response?.status === 403) errorMsg = "Current user is not allowed.";
                if (error.response?.status === 404) errorMsg = "Incident not found.";
                if (error.response?.status === 400) errorMsg = "Cannot edit non-pending incident.";
                if (error.response?.status === 500) errorMsg = "Internal server error.";

                Swal.fire("Error!", errorMsg, "error");
                console.error("Error updating incident:", error);
            } finally {
                document.body.style.cursor = 'default';
            }
        },
    });
};

export default EditCurrentUserIncident;
