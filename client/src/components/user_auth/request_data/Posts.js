import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import SAMPLE from "../../../img/SAMPLE.jpg";
import { ReactComponent as UserLogo } from '../../../img/user_logo.svg';
import { formatDistanceToNow } from 'date-fns';
import GetPosts from "../FetchFunction";

const Posts = () => {
    // Use the hook with a single endpoint
    const { posts: allPostsData, error, loading } = GetPosts("/api/user/posts");
  
    // Loading and error handling
    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error loading posts: {error.message}</p>;
  
    return (
      <div id="posts-con">
        {/* Fallback UI for empty posts */}
        {allPostsData === null || allPostsData.length === 0 ? (
          <article className="empty-post flex-col">
            <div className="user-metadata flex">
              <div className="image-con poster-image">
                <UserLogo />
              </div>
              <div className="text-con">
                <h6 className="poster-name">
                  Earl James Dimapilis <span>- SK Councilor</span>
                </h6>
                <p className="alt-2">30m •</p>
              </div>
            </div>
            <div className="text-con post-metadata flex-col">
              <h5 className="post-content">
                Gone are the days of long waits at the health center. Our barangay has introduced an Online Health Support Request system, which allows residents to quickly request consultations, medications, or referrals online. Whether you’re at home or on the go, you can easily access these services through our website.
              </h5>
              <div className="img-con">
                <img src={SAMPLE} alt="Post image for placeholder" />
              </div>
            </div>
          </article>
        ) : (
          // Render posts dynamically
          allPostsData.map((post) => (
            <article className={`flex-col post-${post.post_id}`} key={post.post_id}>
              <div className="user-metadata flex">
                <div className="image-con poster-image flex">
                  {!post.user_photo_path ? (
                    <UserLogo />
                  ) : (
                    <img
                      src={`http://127.0.0.1:5001/api/${post.user_photo_path.replace(/\\/g, "/")}`}
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
                <h5 className="post-content">{post.post_content}</h5>
                <div className="img-con">
                <img
      src={
        (post.post_photo_path === null || post.post_photo_path === '')
          ? SAMPLE // Use sample if no post image
          : `http://127.0.0.1:5001/api/${post.post_photo_path.replace(/\\/g, "/")}` // Use post photo path
      }
      alt={`Post image for ${post.post_title}`} 
    />
                    
                </div>
                <div className="post-metadata flex">
                  <p>100</p>
                  <p>100 Comments</p>
                </div>
                <div className="btn-con flex">
                  <a href="#" className="like-btn">
                    Like
                  </a>
                  <a href="#" className="comment-btn">
                    Comment
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    );
  };

export default Posts;
