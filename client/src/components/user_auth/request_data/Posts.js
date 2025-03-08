import { useState, useEffect } from "react";
import SAMPLE from "../../../img/SAMPLE.jpg";
import { ReactComponent as UserLogo } from '../../../img/user_logo.svg';
import { formatDistanceToNow } from 'date-fns';
import FetchData from "../FetchFunction";
import httpClient from "../../../httpClient";
const Posts = () => {
  // Active tab state: "posts", "announcements", or "myPosts"
  const [activeTab, setActiveTab] = useState("posts");
  const timestamp = Date.now();

  // Fetch data for each endpoint
  const { data: postsData, error: postsError, loading: postsLoading } = FetchData("/api/user/posts");
  const { data: announcementsData, error: announcementsError, loading: announcementsLoading } = FetchData("/api/user/announcements");

  const [myPostsData, setMyPostsData] = useState(null);
  const [myPostsLoading, setMyPostsLoading] = useState(true);
  const [myPostsError, setMyPostsError] = useState(null);

  // Fetch my posts using httpClient.patch
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setMyPostsLoading(true);
        const response = await httpClient.patch('/api/user/posts'); 
        setMyPostsData(response.data); // Store API response
      } catch (error) {
        setMyPostsError(error);
      } finally {
        setMyPostsLoading(false);
      }
    };

    fetchMyPosts();
  }, []); // Runs only once when the component mounts


  // Select data, error and loading based on the active tab.
  let displayData = [];
  let loading = false;
  let error = null;

  if (activeTab === "posts") {
    displayData = postsData;
    loading = postsLoading;
    error = postsError;
  } else if (activeTab === "announcements") {
    // Normalize announcements structure: extract the nested post data and attach announcement metadata.
    displayData =
      announcementsData &&
      announcementsData.map(item => ({
        post_id: item.post.id,
        post_title: item.post.title,
        post_content: item.post.content,
        post_user_id: item.post.created_by,
        // These fields are not available from the announcement endpoint.
        user_firstname: item.post.user.firstname, // placeholder
        user_middlename: item.post.user.middlename,
        user_lastname: item.post.user.lastname,
        user_resident_type: item.post.user.resident_type,
        user_photo_path: item.post.user.photo_path,
        post_photo_path: item.post.photo_path,
        post_date_created: item.post.date_created,
        // Announcement-specific metadata
        category: item.category,
        publish_date: item.publish_date
      }));
    loading = announcementsLoading;
    error = announcementsError;
  } else if (activeTab === "myPosts") {
    displayData = myPostsData;
    loading = myPostsLoading;
    error = myPostsError;
  }

  // Loading and error handling.
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
      <div id="posts-con">
        <div>
          <div class="btn-group">
            <button
              onClick={() => { setActiveTab("posts")}}
              className={`btn ${activeTab === "posts" ? "btn-primary" : "btn-secondary"}`}
            >
              Posts
            </button>
            <button
              onClick={() => { setActiveTab("announcements")}}
              className={`btn ${activeTab === "announcements" ? "btn-primary" : "btn-secondary"}`}
            >
              Announcements
            </button>
            <button
              onClick={() => { setActiveTab("myPosts")}}
              className={`btn ${activeTab === "myPosts" ? "btn-primary" : "btn-secondary"}`}
            >
              My Posts
            </button>
          </div>
          {/* Fallback UI for empty posts */}
          {displayData === null || displayData.length === 0 ? (
            <article className="empty-post flex-col">
              <div className="user-metadata flex"></div>
              <div className="text-con post-metadata flex-col">
                <h5 className="post-content">No Post Available</h5>
              </div>
            </article>
          ) : (
            // Render posts dynamically
            displayData.map((post) => (
              <article className={`flex-col post-${post.post_id}`} key={post.post_id}>
                <div className="user-metadata flex">
                  <div className="image-con poster-image flex">
                    {!post.user_photo_path ? (
                      <UserLogo />
                    ) : (
                      <img
                        src={`https://storage.googleapis.com/pklink/${post.user_photo_path.replace(/\\/g, "/")}`}
                        alt={`${post.user_firstname} ${post.user_lastname}'s profile`}
                      />
                    )}
                  </div>
                  <div className="text-con">
                    <h6 className="poster-name">
                      {post.user_firstname} {post.user_lastname}{" "}
                      <span>- {post.user_resident_type}</span>
                    </h6>
                    <p className="alt-2">
                      {formatDistanceToNow(new Date(post.post_date_created), { addSuffix: true })} •
                    </p>
                  </div>
                </div>
                <div className="text-con post-data flex-col">
                  <h6>{post.post_title}</h6>
                  <h5 className="post-content">{post.post_content}</h5>
                  {/* Show announcement extra metadata if on announcements tab */}
                  {activeTab === "announcements" && post.category && (
                    <div className="announcement-meta">
                      <small>Category: {post.category}</small>
                    </div>
                  )}
                  <div className="img-con">
                    <img
                      src={
                        (post.post_photo_path === null || post.post_photo_path === '')
                          ? SAMPLE
                          : `https://storage.googleapis.com/pklink/${post.post_photo_path.replace(/\\/g, "/")}?v=${timestamp}`
                      }
                      alt={`Post image for ${post.post_title}`}
                    />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
  );
};

export default Posts;
