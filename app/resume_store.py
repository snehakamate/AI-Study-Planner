import json
import os


RESUME_DB = "uploads/resume_store.json"
# Ensure uploads directory exists
os.makedirs(os.path.dirname(RESUME_DB), exist_ok=True)
# Ensure file exists
if not os.path.exists(RESUME_DB):
    with open(RESUME_DB, "w") as f:
        json.dump({}, f)

def save_resume_text(user_id, resume_text):
    with open(RESUME_DB, "r+") as f:
        data = json.load(f)
        data[user_id] = resume_text
        f.seek(0)
        json.dump(data, f, indent=2)
        f.truncate()

def get_saved_resume(user_id):
    with open(RESUME_DB, "r") as f:
        data = json.load(f)
        return data.get(user_id, "")
