def generate_daily_plan(user_id):
    # In real case, fetch user preferences from DB
    plan = {
        "user": user_id,
        "tasks": [
            {"task": "Watch a tutorial video", "duration": "1 hour"},
            {"task": "Practice coding problems", "duration": "2 hours"},
            {"task": "Revise previous topics", "duration": "1 hour"},
        ]
    }
    return plan
