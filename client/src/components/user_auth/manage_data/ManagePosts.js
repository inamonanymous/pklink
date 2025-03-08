import { useState } from "react";
import DataTable from "react-data-table-component";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreatePostModal from "../modals/post/CreatePostModal";

function ManagePosts() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [activeView, setActiveView] = useState("create");
    const [clickedPostInfo, setClickedPostInfo] = useState({});
    const [showPostInfo, setShowPostInfo] = useState(false);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const handleViewToggle = (view) => {
        setActiveView(view);
        setIsPostModalOpen((prev) => !prev);
    };

    // New function for making an announcement from a post.
    const handleMakeAnnouncement = async () => {
        // Ask for the category input using Swal
        const { value: category } = await Swal.fire({
            title: 'Enter Announcement Category',
            input: 'text',
            inputPlaceholder: 'Category',
            showCancelButton: true,
            confirmButtonText: 'Submit'
        });

        if (category) {
            try {
                document.body.style.cursor = 'wait';
                // Send a POST request with the clicked post's ID and the category provided.
                const response = await httpClient.post('/api/partial_admin/announcements', {
                    req_posts_id: clickedPostInfo.post_id,
                    req_announcement_category: category
                });
                Swal.fire('Success!', 'Announcement created successfully.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to create announcement.', 'error');
            } finally {
                document.body.style.cursor = 'default';
            }
        }
    };

    const { data: allPostsData } = FetchData("/api/user/posts", refreshPosts);

    const handleDeletePost = async (id) => {
        const confirmDialogue = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to continue deleting this post?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (!confirmDialogue.isConfirmed) return;

        try {
            document.body.style.cursor = 'wait';
            await httpClient.delete('/api/partial_admin/posts', { params: { req_post_id: id } });
            setRefreshPosts(prev => !prev);
            setShowPostInfo(false);
            Swal.fire('Deleted!', 'The post has been deleted.', 'success');
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete post.', 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handlePostInRowClick = (post) => {
        setClickedPostInfo(post);
        setShowPostInfo(true);
    };

    // Filter posts based on search term
    const filteredPosts = allPostsData?.filter(post =>
        post.post_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user_lastname.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const columns = [
        { name: "Post ID", selector: row => row.post_id, sortable: true },
        { name: "Post Title", selector: row => row.post_title, sortable: true },
        { name: "Created By", selector: row => `${row.user_lastname}, ${row.user_firstname} ${row.user_middlename}`, sortable: true },
        { name: "Date Created", selector: row => row.post_date_created, sortable: true },
        {
            name: "Actions",
            cell: row => (
                <button className="btn btn-danger" onClick={() => handleDeletePost(row.post_id)}>
                    Delete
                </button>
            ),
        },
    ];

    return (
        <div id="manage-posts" className="flex manage-data">
            <div className="flex-col">
                <div className="btn-group">
                    <button onClick={() => handleViewToggle("create")} className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}>Create Post</button>
                    <button onClick={() => handleViewToggle("manage")} className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}>Manage Posts</button>
                </div>

                {activeView === "create" && <CreatePostModal isPostModalOpen={true} setRefreshPosts={setRefreshPosts} />}

                {activeView === "manage" && (
                    <div className="posts-manage">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DataTable
                            title="Posts List"
                            columns={columns}
                            data={filteredPosts}
                            pagination
                            highlightOnHover
                            onRowClicked={handlePostInRowClick}
                        />
                    </div>
                )}
            </div>

            {isPostModalOpen && (
                <div className="post-info">
                    {!showPostInfo ? (
                        <h3>Select Post</h3>
                    ) : (
                        <>
                            <h3>{clickedPostInfo.post_title}</h3>
                            <h4>{clickedPostInfo.post_content}</h4>
                            <h5>{clickedPostInfo.user_lastname}, {clickedPostInfo.user_firstname} {clickedPostInfo.user_middlename}</h5>
                            <button onClick={() => handleDeletePost(clickedPostInfo.post_id)}>Delete Post</button>
                            <button onClick={handleMakeAnnouncement}>Make as Announcement</button>

                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ManagePosts;
