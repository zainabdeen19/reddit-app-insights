# reddit-app-insights
A Reddit Insights App
----------------------------------------
Reddit, much like other social media platforms, provides a way for users to communicate their interests etc. I build an application that listens to your choice of subreddits (best to choose one with a good amount of posts). It would show:
•	Posts with most up votes
•	Users with most posts
This app also provides some way to report these values to a user (periodically log to terminal, return from RESTful web service, etc.).
To acquire near real time statistics from Reddit, we need to continuously request data from Reddit's rest APIs.  Reddit implements rate limiting and provides details regarding rate limit used, rate limit remaining, and rate limit reset period via response headers. This App uses these values to control throughput in an even and consistent manner while utilizing a high percentage of the available request rate. While designing and developing this application, I kept the SOLID principles in mind.
-----------------------------------------
Accessing the Reddit API:
To get the API, register here
Additional documentation can be found here
Tracking the top subreddits | Reddit Charts
`RedditCharts is a database of the top subreddits on Reddit.

