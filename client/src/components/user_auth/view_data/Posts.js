import { useState, useEffect } from "react";
import httpClient from "../../../httpClient";
import SAMPLE from "../../../img/SAMPLE.jpg";

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
        <div className="posts-con">
            {allPostsData.map((post) => ( // Map through posts to render
                <article className={`post-${post.post_id}`} key={post.post_id}>
                        <div className="text-con">
                            <h2>{post.post_title}</h2>
                            <p>{post.post_content}</p>
                            <p>{post.user_firstname} {post.user_lastname} on {new Date(post.post_date_created).toLocaleDateString()}</p>
                        </div>
                        <div className="image-con">
                            <img src={SAMPLE} />
                        </div>
                </article>
            ))}
        </div>
    );
}

export default Posts;
