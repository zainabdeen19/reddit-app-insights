// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [stats, setStats] = useState(null);
    const subreddit = 'programming'; // Replace 'programming' with the name of the subreddit you're interested in

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/reddit/stats`);
                const fetchedStats = response.data;

                setStats(fetchedStats);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Reddit Statistics for {subreddit}</h1>
            {stats ? (
                <div>
                    <h2>Posts with Most Upvotes:</h2>
                    <ul>
                        {stats.postsWithMostUpvotes.map((post, index) => (
                            <li key={index}>{post.title} - {post.ups} upvotes</li>
                        ))}
                    </ul>
                    <h2>Users with Most Posts:</h2>
                    <ul>
                        {Object.entries(stats.usersWithMostPosts).map(([user, count]) => (
                            <li key={user}>{user} - {count} posts</li>
                        ))}
                    </ul>
                    <h2>Rate Limit:</h2>
                    <p>Remaining: {stats.rateLimit.remaining}</p>
                    <p>Reset Time: {new Date(stats.rateLimit.resetTime).toLocaleString()}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default App;
