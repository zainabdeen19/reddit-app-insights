// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

let postsWithMostUpvotes = [];
let usersWithMostPosts = {};
let rateLimitRemaining = 100; // Assuming initial rate limit remaining
let rateLimitReset = new Date(); // Assuming initial rate limit reset time

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware to throttle requests based on Reddit rate limit
app.use((req, res, next) => {
    const now = new Date();
    if (now < rateLimitReset) {
        if (rateLimitRemaining <= 0) {
            const resetTime = Math.ceil((rateLimitReset - now) / 1000); // Convert reset time to seconds
            res.status(429).json({ error: 'Rate limit exceeded. Please try again later.', resetTime });
        } else {
            rateLimitRemaining--;
            next();
        }
    } else {
        // Reset rate limit information
        rateLimitRemaining = 100; // Assuming default rate limit is 100 requests per minute
        rateLimitReset = new Date(now.getTime() + 60000); // Assuming rate limit resets in 60 seconds
        next();
    }
});

// Route to fetch Reddit posts from a specific subreddit
app.get('/reddit/posts/:subreddit', async (req, res) => {
    const subreddit = req.params.subreddit;

    try {
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json?limit=100`);
        const posts = response.data.data.children;

        // Update posts with most upvotes
        postsWithMostUpvotes = posts
            .map(post => post.data)
            .sort((a, b) => b.ups - a.ups)
            .slice(0, 10);

        // Update users with most posts
        posts.forEach(post => {
            const author = post.data.author;
            if (usersWithMostPosts[author]) {
                usersWithMostPosts[author]++;
            } else {
                usersWithMostPosts[author] = 1;
            }
        });

        // Update rate limit information from response headers
        rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining']) || rateLimitRemaining;
        const resetTimeSeconds = parseInt(response.headers['x-ratelimit-reset']) || 60; // Default reset time if header not provided
        rateLimitReset = new Date(Date.now() + (resetTimeSeconds * 1000));

        res.json(posts);
    } catch (error) {
        console.error(`Error fetching Reddit posts for subreddit '${subreddit}':`, error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get statistics
app.get('/reddit/stats', (req, res) => {
    const stats = {
        postsWithMostUpvotes,
        usersWithMostPosts,
        rateLimit: {
            remaining: rateLimitRemaining,
            resetTime: rateLimitReset
        }
    };
    res.json(stats);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
