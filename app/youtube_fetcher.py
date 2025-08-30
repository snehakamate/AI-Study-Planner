# app/youtube_fetcher.py

import os
from dotenv import load_dotenv
import requests

# Load .env variables
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

print("✅ Loaded API Key:", API_KEY)

def fetch_youtube_videos(query):
    """
    Fetch top 5 YouTube videos matching the query.
    """
    if not API_KEY:
        print("❌ API Key is missing")
        return []

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "key": API_KEY,
        "maxResults": 5,
        "type": "video"
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "items" not in data:
        print("❌ Unexpected API response:", data)
        return []

    results = [
        {
            "title": item["snippet"]["title"],
            "videoId": item["id"]["videoId"]
        }
        for item in data["items"]
    ]
    return results
