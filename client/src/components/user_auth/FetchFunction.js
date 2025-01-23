import { useState, useEffect } from "react";
import httpClient from "../../httpClient";

const GetPosts = (endpoint, refreshTrigger) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await httpClient.get(endpoint); // Use the passed endpoint
        if (resp.status === 200) {
          setPosts(resp.data); // Set the posts data
        }
      } catch (err) {
        setError(err); // Set the error if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };


    fetchPosts();
    
  }, [refreshTrigger]); // Now depends on both `endpoint` and `refreshTrigger`

  return { posts, error, loading };
};

export default GetPosts;
