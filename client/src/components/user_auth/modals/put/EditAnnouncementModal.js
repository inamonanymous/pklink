import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";

const EditAnnouncementModal = (announcementData, setRefreshAnnouncements, setClickedAnnouncementInfo) => {
  // If announcementData is an array, take the first element
  const announcement = Array.isArray(announcementData) ? announcementData[0] : announcementData;

  console.log("Announcement to edit:", announcement);

  Swal.fire({
    title: "Edit Announcement",
    html: `
      <input id="swal-announcement-category" class="swal2-input" placeholder="Category" value="${announcement.category || ""}">
      <input type="date" id="swal-announcement-publish-date" class="swal2-input" value="${announcement.publish_date ? announcement.publish_date.split("T")[0] : ""}">
      <select id="swal-announcement-is-published" class="swal2-input">
        <option value="true" ${announcement.is_published ? "selected" : ""}>Published</option>
        <option value="false" ${!announcement.is_published ? "selected" : ""}>Unpublished</option>
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: "Update Announcement",
    preConfirm: async () => {
      const newCategory = document.getElementById("swal-announcement-category").value.trim();
      const newPublishDate = document.getElementById("swal-announcement-publish-date").value;
      const newIsPublished = document.getElementById("swal-announcement-is-published").value === "true";

      const updatedAnnouncement = {
        req_announcement_id: announcement.id,
        req_announcement_category: newCategory === announcement.category ? null : newCategory,
        req_announcement_publish_date: newPublishDate === (announcement.publish_date ? announcement.publish_date.split("T")[0] : "") ? null : newPublishDate,
        req_announcement_is_published: newIsPublished,
      };

      try {
        document.body.style.cursor = 'wait';
        const response = await httpClient.put("/api/partial_admin/announcements", updatedAnnouncement);
        if (response.status !== 200) {
          throw new Error("Bad request");
        }
        Swal.fire("Updated!", "The announcement has been updated.", "success");
        setRefreshAnnouncements(prev => !prev);
        setClickedAnnouncementInfo(updatedAnnouncement);
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

export default EditAnnouncementModal;
