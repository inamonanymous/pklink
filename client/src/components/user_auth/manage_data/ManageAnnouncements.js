import { format } from 'date-fns';
import { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import EditAnnouncementModal from "../modals/put/EditAnnouncementModal";

function ManageAnnouncements() {
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("create");
  const [clickedAnnouncementInfo, setClickedAnnouncementInfo] = useState({});
  const [showAnnouncementInfo, setShowAnnouncementInfo] = useState(false);
  const [refreshAnnouncements, setRefreshAnnouncements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMakeAnnouncement = async (postId) => {
    
    const { value: category } = await Swal.fire({
      title: 'Enter Announcement Category',
      input: 'text',
      inputPlaceholder: 'Category',
      showCancelButton: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Category is required');
        }
        return value;
      }
    });
  
    if (category) {
      try {
        document.body.style.cursor = 'wait';
        const response = await httpClient.post('/api/partial_admin/announcements', {
           req_posts_id: postId,
           req_announcement_category: category,
        });
        Swal.fire('Success!', 'Announcement created successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to create announcement.', 'error');
      } finally {
        document.body.style.cursor = 'default';
      }
    }
  };
  

  // Fetch announcements from the partial admin endpoint.
  const { data: allAnnouncementsData } = FetchData("/api/partial_admin/announcements", refreshAnnouncements);

  const handleDeleteAnnouncement = async (id) => {
    const confirmDialogue = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to continue deleting this announcement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!confirmDialogue.isConfirmed) return;

    try {
      document.body.style.cursor = 'wait';
      await httpClient.delete('/api/partial_admin/announcements', { params: { req_announcement_id: id } });
      setRefreshAnnouncements(prev => !prev);
      setShowAnnouncementInfo(false);
      setIsAnnouncementModalOpen(true);
      Swal.fire('Deleted!', 'The announcement has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete announcement.', 'error');
    } finally {
      document.body.style.cursor = 'default';
    }
  };

  const handleAnnouncementRowClick = (announcement) => {
    setClickedAnnouncementInfo(announcement);
    setShowAnnouncementInfo(true);
    setIsAnnouncementModalOpen(true);
  };

  // Filter announcements based on search term.
  const filteredAnnouncements = allAnnouncementsData?.filter(announcement =>
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (announcement.post && announcement.post.title.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const columns = [
    { name: "Announcement ID", selector: row => row.id, sortable: true },
    { name: "Post Title", selector: row => row.post?.title || "N/A", sortable: true },
    { name: "Category", selector: row => row.category, sortable: true },
    { name: "Published", selector: row => row.is_published ? "Yes" : "No", sortable: true },
    { name: "Publish Date", selector: row => format(new Date(row.publish_date), "MMM dd yy"), sortable: true },
    {
      name: "Actions",
      cell: row => (
        <button className="btn btn-danger" onClick={() => handleDeleteAnnouncement(row.id)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div id="manage-announcements" className="flex manage-data">
      <div className="flex-col">


       
          <div className="announcements-manage">
            <input
              type="text"
              placeholder="Search announcements..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DataTable
              title="Announcements List"
              columns={columns}
              data={filteredAnnouncements}
              pagination
              highlightOnHover
              onRowClicked={handleAnnouncementRowClick}
            />
          </div>
      </div>

      {isAnnouncementModalOpen && (
        <div className="announcement-info">
          {!showAnnouncementInfo ? (
            <h3>Select Announcement</h3>
          ) : (
            <>
              <h3>{clickedAnnouncementInfo.post?.title || "No Title"}</h3>
              <h4>Category: {clickedAnnouncementInfo.category}</h4>
              <h5>Publish Date: {clickedAnnouncementInfo.publish_date}</h5>
              <button onClick={() => handleDeleteAnnouncement(clickedAnnouncementInfo.id)}>
                Delete Announcement
              </button>
              <button onClick={() => EditAnnouncementModal(allAnnouncementsData, setRefreshAnnouncements, setClickedAnnouncementInfo)}>
                Edit Announcement
              </button>
              
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageAnnouncements;
