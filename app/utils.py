import json
from datetime import datetime

def log_user_activity(free_time, days_completed, engagement, predicted_minutes):
    """
    Append a prediction record to the JSON log file.
    """
    record = {
        "timestamp": datetime.utcnow().isoformat(),
        "free_time_minutes": free_time,
        "days_completed": days_completed,
        "engagement_score": engagement,
        "predicted_minutes": predicted_minutes
    }

    try:
        # If file exists, load and append
        with open("data/user_activity_log.json", "r+") as f:
            data = json.load(f)
            data.append(record)
            f.seek(0)
            json.dump(data, f, indent=2)

    except FileNotFoundError:
        # If file doesn't exist, create new list
        with open("data/user_activity_log.json", "w") as f:
            json.dump([record], f, indent=2)

def sample_helper():
    return "Helper function here"
