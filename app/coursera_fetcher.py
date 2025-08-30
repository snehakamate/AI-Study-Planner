# app/coursera_fetcher.py

def fetch_coursera_courses(query):
    """
    Returns example Coursera courses dynamically based on the query.
    """
    search_url = f"https://www.coursera.org/search?query={query.replace(' ', '%20')}"

    return [
        {
            "title": f"{query} Fundamentals",
            "url": search_url
        },
        {
            "title": f"Advanced {query} Specialization",
            "url": search_url
        }
    ]
