import httpClient from "../../../../httpClient";
import Swal from "sweetalert2";

const EditCurrentUserHealthAssistModal = (allUserHealthRequests, request_id, setRefreshRequests) => {
    const selectedRequest = allUserHealthRequests.find(req => req.request_id === request_id);
    
    if (!selectedRequest) {
        console.error("Error: Request data not found.");
        return;
    }

    console.log("Editing Health assist:", selectedRequest); // Debugging

    // Enum values for document_type (match exactly as stored in DB)
    /* const documentTypes = [
        { value: "cedula", label: "Cedula" },
        { value: "brgy_certificate", label: "Barangay Certificate" },
        { value: "brgy_clearance", label: "Barangay Clearance" }
    ]; */
/* 
    <label for="swal-document-type">Document Type</label>
    <select id="swal-document-type" class="swal2-input">
        ${documentTypes.map(type => `
            <option value="${type.value}" ${selectedRequest.document_type === type.value ? "selected" : ""}>
                ${type.label}
            </option>
        `).join("")}
    </select> */

    // Show SweetAlert2 modal
    Swal.fire({
        title: "Edit Health Assistance",
        html: `
            <div
                style="
                    text-align: left;    
                    display: flex;
                    flex-direction: column;
                "
            >
                

                <label for="swal-support-type">Support type</label>
                <input id="swal-support-type" class="swal2-input" placeholder="Reason" value="${selectedRequest?.support_type || ''}">

                <label for="swal-description">Description</label>
                <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${selectedRequest?.description_text || ''}</textarea>

                <label for="swal-additional-info">Additional Info</label>
                <textarea id="swal-additional-info" class="swal2-textarea" placeholder="Additional Info">${selectedRequest?.additional_info || ''}</textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Update Document",
        preConfirm: async () => {
            const updatedDocument = {
                req_request_id: request_id,
                req_support_type: document.getElementById("swal-support-type").value, // Correct Enum Value,
                req_description_text: document.getElementById("swal-description").value,
                req_additional_info: document.getElementById("swal-additional-info").value
            };

            console.log("Updated Document:", updatedDocument); // Debugging
            try {
                document.body.style.cursor = 'wait';
                const response = await httpClient.put("/api/user/health_support_requests", updatedDocument);
                if (response.status !== 200) {
                    throw new Error("Bad request");
                }

                Swal.fire("Updated!", "The document has been updated.", "success");
                setRefreshRequests((prev) => !prev); // Refresh request list
            } catch (error) {
                let errorMsg;
                if (error.response?.status === 403) errorMsg = 'Current user is not allowed.';
                if (error.response?.status === 404) errorMsg = 'Target request not found.';
                if (error.response?.status === 400) errorMsg = 'Cannot edit non pending request';
                if (error.response?.status === 500) errorMsg = `Internal server error (it's on our fault :>)`;
                Swal.fire("Error!", errorMsg, "error");
                console.error("Error updating document:", error);
            } finally {
                document.body.style.cursor = 'default';
            }
        },
    });
};

export default EditCurrentUserHealthAssistModal;
