import { React, useState } from "react";
import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";

const CreatePostModal = ({ isPostModalOpen, setRefreshPosts }) => {

  const [postData, setPostData] = useState({
    req_post_title: "",
    req_post_content: "",
    req_post_user_id: "",
    req_post_photo: null,
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPostData((prevInfo) => ({
      ...prevInfo,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("req_post_title", postData.req_post_title);
    formData.append("req_post_content", postData.req_post_content);
    formData.append("req_post_photo", postData.req_post_photo);

    try {
      document.body.style.cursor = "wait";
      const resp = await httpClient.post("/api/partial_admin/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (resp.status === 400) {
        Swal.fire("Error", "Bad Request", "error");
        return;
      }

      if (resp.status === 404) {
        Swal.fire("Error", "No User Found", "error");
        return;
      }

      Swal.fire("Success", "Post added successfully!", "success");

      document.getElementById("addPostForm").reset();
      setPostData({
        req_post_title: "",
        req_post_content: "",
        req_post_user_id: "",
        req_post_photo: null,
      });
      setRefreshPosts((prev) => !prev);
    } catch (error) {
        console.error(error);
        Swal.fire("Error", `${error.response.data.message}`, "error");
    } finally {
        document.body.style.cursor = "default";
    }
  };

  if (!isPostModalOpen) return null;

  return (
    <div className="posts-create">
        <form onSubmit={handleSubmit} id="addPostForm">
          <div className="d-flex flex-column">
            <h3>Create New Post</h3>

            <div className="mb-3">
              <input
                type="text"
                id="req_post_title_input"
                name="req_post_title"
                placeholder="Enter Title"
                value={postData.req_post_title}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <textarea
                id="req_post_content_input"
                name="req_post_content"
                placeholder="Enter Content"
                rows="5"
                value={postData.req_post_content}
                onChange={handleInputChange}
                className="form-control"
              ></textarea>
            </div>

            <div className="mb-3">
              <input
                type="file"
                name="req_post_photo"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
  );
};

export default CreatePostModal;
