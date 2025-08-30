import os
import requests

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def fetch_github_repos(query):
    url = "https://api.github.com/search/repositories"
    params = {"q": query, "per_page": 5}
    headers = {
        "Accept": "application/vnd.github.v3+json",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    repos = []
    if "items" in data:
        repos = [
            {"repo": item["full_name"], "url": item["html_url"]}
            for item in data["items"]
        ]
    return repos
