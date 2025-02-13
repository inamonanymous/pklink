import React, { useState } from "react";
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
import Swal from "sweetalert2";

function ManagePosts() {
    const [postInfoLoading, setPostInfoLoading] = useState(false);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const { data: allPostsData, error, loading } = FetchData("/api/user/posts", refreshPosts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPostInfo, setShowPostInfo] = useState(false);
    const [clickedPostInfo, setClickedPostInfo] = useState({});

    const [postData, setPostData] = useState({
        req_post_title: '',
        req_post_content: '',
        req_post_user_id: '',
        req_post_photo: null,
    });

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
        }
    };
    

    const handleModalToggle = () => {
        setIsModalOpen((prevState) => !prevState);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setPostData((prevInfo) => ({
            ...prevInfo,
            [name]: files[0],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('req_post_title', postData.req_post_title);
        formData.append('req_post_content', postData.req_post_content);
        formData.append('req_post_photo', postData.req_post_photo);

        try {
            const resp = await httpClient.post('/api/partial_admin/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (resp.status === 400) {
                Swal.fire('Error', 'Bad Request', 'error');
                return;
            }

            if (resp.status === 404) {
                Swal.fire('Error', 'No User Found', 'error');
                return;
            }

            Swal.fire('Success', 'Post added successfully!', 'success');

            document.getElementById("addPostForm").reset();
            setPostData({
                req_post_title: '',
                req_post_content: '',
                req_post_user_id: '',
                req_post_photo: null,
            });
            setIsModalOpen(false);
            setRefreshPosts((prev) => {
                return !prev; // Toggle state
            });

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error adding post', 'error');
        }
    };

    return (
        <div id="manage-posts" className="flex">
            <div className="post-controls">
                {/* Button to open the modal */}
                <button onClick={handleModalToggle}>Create new post</button>
                {isModalOpen && (
                    <form onSubmit={handleSubmit} id="addPostForm">
                    {/* Modal */}
                        <div className="modal">
                            <div className="modal-content flex-col">
                                <h3>Create New Post</h3>

                                {/* Title input */}
                                <input
                                    type="text"
                                    id="req_post_title_input"
                                    name="req_post_title"
                                    placeholder="Enter Title"
                                    value={postData.req_post_title}
                                    onChange={handleInputChange}
                                />

                                {/* Content input */}
                                <textarea
                                    id="req_post_content_input"
                                    name="req_post_content"
                                    placeholder="Enter Content"
                                    rows="5"
                                    value={postData.req_post_content}
                                    onChange={handleInputChange}
                                ></textarea>

                                {/* Photo upload */}
                                <input
                                    type="file"
                                    name="req_post_photo"
                                    onChange={handleFileChange}
                                />

                                {/* Action buttons */}
                                <div className="modal-actions">
                                    <button onClick={handleModalToggle}>Cancel</button>
                                    <button>Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
                {/* Search bar */}
                <input type="text" placeholder="Search Posts" />
                
                <div className="table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Post I.D.</th>
                                <th>Post title</th>
                                <th>Posted by</th>
                                <th>User type</th>
                                <th>Date created</th>
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
        </div>
    );
}

export default ManagePosts;
