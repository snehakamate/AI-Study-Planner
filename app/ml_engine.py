import requests
import json

# === External API Configuration ===
EXTERNAL_API_URL = "https://study-time-predicter-api-1.onrender.com/predict"

# === Prediction Function ===
def predict_study_time(data):
    """
    Predict study time using external API.

    Parameters:
        data (dict): {
            "free_time_minutes": float,
            "days_completed": int,
            "engagement_score": float
        }

    Returns:
        float: Predicted study time in minutes (non-negative)
    """
    try:
        # Transform data to match external API format
        api_data = {
            "failures": 0,  # Default value
            "higher": 0,  # 0 for no, 1 for yes
            "absences": 0,  # Default value
            "freetime": min(5, max(1, int(data.get("free_time_minutes", 120) / 30))),  # Convert to 1-5 scale
            "goout": 3,  # Default value
            "famrel": 4,  # Default value
            "famsup": 1,  # 0 for no, 1 for yes
            "schoolsup": 0,  # 0 for no, 1 for yes
            "paid": 0,  # 0 for no, 1 for yes
            "traveltime": 2,  # Default value
            "health": 4,  # Default value
            "internet": 1,  # 0 for no, 1 for yes
            "age": 18  # Default value
        }

        # Make request to external API
        response = requests.post(
            EXTERNAL_API_URL,
            headers={"Content-Type": "application/json"},
            json=api_data,
            timeout=30
        )

        if response.status_code != 200:
            raise RuntimeError(f"External API error: {response.status_code}")

        result = response.json()
        
        # Extract prediction from API response
        # The API returns study time in hours, convert to minutes
        predicted_hours = result.get("predicted_study_time", result.get("predicted_hours", 0))
        predicted_minutes = float(predicted_hours) * 60

        return max(0, predicted_minutes)  # Ensure non-negative

    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Invalid API response: {e}")
    except Exception as e:
        raise RuntimeError(f"Prediction failed: {e}")

# === Legacy Retraining Function (No longer needed) ===
def retrain_model():
    """
    This function is no longer needed as we use external API.
    Kept for backward compatibility.
    """
    print("ℹ️ Retraining is not needed - using external API for predictions")
    return True
