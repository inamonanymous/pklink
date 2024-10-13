import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import SAMPLE from "../../../img/SAMPLE.jpg";
import { ReactComponent as UserLogo } from '../../../img/user_logo.svg';

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
                        </div>
                    </article>
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
                        </div>
                    </article>
                </>
            ) : (
                allPostsData.map((post) => (
                <article className={`post-${post.post_id}`} key={post.post_id}>
                    <div className="text-con">
                        <h2>{post.post_title}</h2>
                        <p>{post.post_content}</p>
                        <p>{post.user_firstname} {post.user_lastname} on {new Date(post.post_date_created).toLocaleDateString()}</p>
                    </div>
                    <div className="image-con">
                        <img src={SAMPLE} alt={`Post image for ${post.post_title}`} />
                    </div>
                </article>
                ))
            )}
        </div>
    );
}

export default Posts;
