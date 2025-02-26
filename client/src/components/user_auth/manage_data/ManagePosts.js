import React, { useState } from "react";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";
import CreatePostModal from "../modals/post/CreatePostModal";


function ManagePosts() {
    const [postInfoLoading, setPostInfoLoading] = useState(false);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const { data: allPostsData, error, loading } = FetchData("/api/user/posts", refreshPosts);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [showPostInfo, setShowPostInfo] = useState(false);
    const [clickedPostInfo, setClickedPostInfo] = useState({});

    const [activeView, setActiveView] = useState("create");
    const handleViewToggle = (view) => {
        setActiveView(view);
        setIsPostModalOpen((prevState) => !prevState);
    };

    const handleDeletePost = async (e, postId) => {
        e.preventDefault();
    
        const confirmDialogue = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to continue deleting this post?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });
    
        if (!confirmDialogue.isConfirmed) {
            return;
        }
    
        try {
            document.body.style.cursor = 'wait';
            console.log(`Deleting post with ID: ${postId}`); // Debugging
            await httpClient.delete(`/api/partial_admin/posts`, {
                params: { req_post_id: postId }
            });
    
            setRefreshPosts((prev) => !prev);
            setShowPostInfo(false);
    
            Swal.fire('Deleted!', 'The post has been deleted.', 'success');
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
    
            let errorMsg = 'An error occurred while deleting the post.';
            if (error.response?.status === 403) errorMsg = 'Current user is not allowed.';
            if (error.response?.status === 404) errorMsg = 'Target post not found.';
            if (error.response?.status === 400) errorMsg = 'Invalid request.';
    
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleModalToggle = () => {
        if (showPostInfo) {
            setShowPostInfo(false);
        }
        console.log('hellow wowlrd ')
        setIsPostModalOpen((prevState) => !prevState);
    };

    const handlePostInRowClick = async (e, post_id) => {
        e.preventDefault();
        setPostInfoLoading(true);

        const clickedPost = allPostsData.find((post) => post.post_id === post_id);
        if (!clickedPost) {
            console.error("Post not found");
            setPostInfoLoading(false);
            return;
        }

        // Directly set clickedPostInfo and showPostInfo
        setClickedPostInfo(clickedPost);
        setPostInfoLoading(false);
        setShowPostInfo(true);
        setRefreshPosts((prev) => {
            return !prev; // Toggle state
        });
    };

    

    return (
        <div id="manage-posts" className="flex manage-data">
            <div className="flex-col">
                <div className="btn-group">
                    <button
                        onClick={() => handleViewToggle("create")}
                        className={`btn ${activeView === "create" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Create Post
                    </button>
                    <button
                        onClick={() => handleViewToggle("manage")}
                        className={`btn ${activeView === "manage" ? "btn-primary" : "btn-secondary"}`}
                    >
                        Manage Posts
                    </button>
                </div>
            {activeView === "create" && (
                <div className="posts-create">
                    <CreatePostModal
                        isPostModalOpen={true}
                        setRefreshPosts={setRefreshPosts}
                    />
                </div>
            )}

            {activeView === "manage" && (
                <div className="posts-manage">
                    {/* Search bar */}
                    <input type="text" placeholder="Search Posts" />
                    
                    <div className="table-con">
                        <table className="table table-bordered table-hover table-stripped">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Post I.D.</th>
                                    <th scope="col">Post title</th>
                                    <th scope="col">Posted by</th>
                                    <th scope="col">User type</th>
                                    <th scope="col">Date created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPostsData === null || allPostsData.length === 0 ? (
                                    <>No posts</>
                                ) : (
                                    allPostsData.map((post) => (
                                        <tr 
                                            key={post.post_id}
                                            onClick={(e) => handlePostInRowClick(e, post.post_id)}
                                        >
                                            <td>{post.post_id}</td>
                                            <td>{post.post_title}</td>
                                            <td>
                                                {post.user_lastname}, {post.user_firstname}{" "}
                                                {post.user_middlename}
                                            </td>
                                            <td>{post.user_resident_type}</td>
                                            <td>{post.post_date_created}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
            
            {isPostModalOpen && (
                <div className="post-info">
                    {!showPostInfo ? (
                        <>
                        <h3>Select Post</h3>
                        </>
                    ) : postInfoLoading ? (
                        <>
                            <h3>Loading...</h3>
                        </>
                    ) : (
                        <>
                            <h3>{clickedPostInfo.post_title}</h3>
                            <h4>{clickedPostInfo.post_content}</h4>
                            <h4>{clickedPostInfo.post_date_created}</h4>
                            <h5>{clickedPostInfo.user_lastname}, {clickedPostInfo.user_firstname} {clickedPostInfo.user_middlename}</h5>
                            <button onClick={(e) => handleDeletePost(e, clickedPostInfo.post_id)}>
                                Delete Post
                            </button>
                            <button>Edit Post</button>
                        </>
                    )}
                    
                </div>
            ) }
        </div>
    );
}

export default ManagePosts;
