import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import SAMPLE from "../../../img/SAMPLE.jpg";
import { ReactComponent as UserLogo } from '../../../img/user_logo.svg';
import { formatDistanceToNow } from 'date-fns';

function Posts() {
    const [allPostsData, setAllPostData] = useState([]); // Initialize as an array

    useEffect(() => {
        const fetchPosts = async () => { // Define an async function
            console.log('Fetching posts...');

            try {
                const resp = await httpClient.get('/api/user/posts'); // Await the response
                if (resp.status === 200) {
                    setAllPostData(resp.data); // Set the posts data
                    console.log("response data: ", resp.data);
                }
            } catch (error) {
                console.error("Error fetching posts:", error); // Log error if any
            }
        };

        fetchPosts(); // Call the async function
    }, []);

    return (
        <div id="posts-con">
            {allPostsData === null || allPostsData.length === 0 ? (
             <>
                <article className="empty-post flex-col">
                        <div className="user-metadata flex">
                            <div className="image-con poster-image">
                                <UserLogo />
                            </div>
                            <div className="text-con">
                                <h6 className="poster-name">
                                    Earl James Dimapilis <span>
                                                - SK Councilor
                                        </span>
                                </h6>
                                <p className="alt-2">
                                    30m •
                                </p>
                            </div>
                        </div>
                        <div className="text-con post-metadata flex-col">
                            <h5 className="post-content">
                                Gone are the days of long waits at the health center. Our barangay has introduced an Online Health Support Request system, which allows residents to quickly request consultations, medications, or referrals online. Whether you’re at home or on the go, you can easily access these services through our website.
                            </h5>
                            <div className="img-con">
                                <img src={SAMPLE} alt={`Post image for`} />
                            </div>
                            <div>
                                
                            </div>
                        </div>
                </article>
                </>
            ) : (
                allPostsData.map((post) => (
                <article className={`flex-col post-${post.post_id}`} key={post.post_id}>
                    <div className="user-metadata flex">
                            <div className="image-con poster-image flex">
                                {!post.user_photo_path ? (
                                    <UserLogo />
                                ) : (
                                    <img 
                                        src={`http://127.0.0.1:5001/api/${post.user_photo_path.replace(/\\/g, '/')}`} 
                                        alt={`${post.user_firstname} ${post.user_lastname}'s profile`} 
                                    />
                                )}
                            </div>

                            <div className="text-con">
                                <h6 className="poster-name">
                                    {post.user_firstname} {post.user_lastname} <span>
                                                - {post.user_resident_type}
                                        </span>
                                </h6>
                                <p className="alt-2">
                                {formatDistanceToNow(new Date(post.post_date_created), { addSuffix: true })} •
                                </p>
                            </div>
                    </div>
                    <div className="text-con post-data flex-col">
                            <h5 className="post-content">
                                {post.post_content}
                            </h5>
                            <div className="img-con">
                                <img src={SAMPLE} alt={`Post image for ${post.post_title}`} />
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
}

export default Posts;
