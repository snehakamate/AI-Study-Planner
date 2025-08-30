from flask import Flask, Blueprint, request, jsonify
import json
import os
from werkzeug.utils import secure_filename
import requests

# Local modules
from app.resume_store import save_resume_text, get_saved_resume
from app.youtube_fetcher import fetch_youtube_videos
from app.coursera_fetcher import fetch_coursera_courses
from app.github_fetcher import fetch_github_repos
from app.roadmap_generator import generate_roadmap
from app.resume_interview_engine import extract_text_from_resume, generate_interview_questions
from app.utils import log_user_activity
from app.ml_engine import EXTERNAL_API_URL

app = Flask(__name__)
main = Blueprint("main", __name__)

# ✅ Health Check
@main.route("/")
def index():
    return jsonify({"message": "✅ AI Study Planner API is running"})

# ✅ Study Time Prediction (Proxy to External API) with CORS preflight
@main.route("/api/predict", methods=["POST", "OPTIONS"])
def api_predict():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return ("", 200)

    try:
        incoming_json = request.get_json(force=True, silent=True) or {}

        # Try forwarding to the external API with basic retries
        timeouts = [15, 30]
        last_err = None
        for t in timeouts:
            try:
                resp = requests.post(
                    EXTERNAL_API_URL,
                    headers={"Content-Type": "application/json"},
                    json=incoming_json,
                    timeout=t,
                )
                if resp.status_code == 200:
                    # Ensure non-empty and JSON response; otherwise fallback
                    raw_text = (resp.text or "").strip()
                    if not raw_text:
                        last_err = RuntimeError("External API returned 200 with empty body")
                    else:
                        try:
                            data = resp.json()
                            return jsonify(data), 200
                        except ValueError:
                            last_err = RuntimeError("External API returned 200 with non-JSON body")
                last_err = RuntimeError(f"External API {resp.status_code}: {resp.text[:200]}")
            except requests.exceptions.RequestException as e:
                last_err = e

        # Fallback: compute a simple heuristic prediction so the UI remains usable
        try:
            failures = int(incoming_json.get("failures", 0) or 0)
            higher = int(incoming_json.get("higher", 0) or 0)
            absences = int(incoming_json.get("absences", 0) or 0)
            freetime = int(incoming_json.get("freetime", 3) or 3)
            goout = int(incoming_json.get("goout", 3) or 3)
            famrel = int(incoming_json.get("famrel", 3) or 3)
            famsup = int(incoming_json.get("famsup", 0) or 0)
            schoolsup = int(incoming_json.get("schoolsup", 0) or 0)
            paid = int(incoming_json.get("paid", 0) or 0)
            traveltime = int(incoming_json.get("traveltime", 2) or 2)
            health = int(incoming_json.get("health", 3) or 3)
            internet = int(incoming_json.get("internet", 1) or 1)
            age = int(incoming_json.get("age", 18) or 18)

            # Simple deterministic heuristic in hours/day
            base = 0.5
            score = (
                base
                + 0.8 * freetime
                - 0.10 * goout
                + 0.10 * (famrel - 3)
                + 0.05 * famsup
                + 0.03 * schoolsup
                + 0.02 * paid
                - 0.15 * traveltime
                + 0.20 * (health - 3)
                + 0.20 * internet
                + 0.30 * higher
                - 0.20 * failures
                - 0.05 * absences
                + 0.02 * max(0, 25 - abs(age - 18))
            )
            predicted_hours = max(0.25, min(8.0, round(score, 2)))

            fallback = {
                "predicted_hours": predicted_hours,
                "confidence_level": "60%",
                "key_influencing_factors": [
                    "Free time",
                    "Health",
                    "Travel time",
                    "Failures/absences",
                ],
                "recommendation": (
                    "Focus on consistent short study blocks. Reduce distractions and align study windows with high energy periods."
                ),
                "note": "Returned by fallback heuristic due to external API timeout",
            }
            return jsonify(fallback), 200
        except Exception:
            # If fallback itself fails, return the last API error
            return jsonify({"error": f"API request failed: {last_err}"}), 502

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Unified Resource Fetch
@main.route("/api/resources")
def api_resources():
    topic = request.args.get("topic", "").strip()
    if not topic:
        return jsonify({"error": "Missing topic parameter"}), 400

    try:
        youtube_videos = []
        coursera_courses = []
        github_repos = []

        try:
            youtube_videos = fetch_youtube_videos(topic)
        except Exception as e:
            print("❌ YouTube error:", e)

        try:
            coursera_courses = fetch_coursera_courses(topic)
        except Exception as e:
            print("❌ Coursera error:", e)

        try:
            github_repos = fetch_github_repos(topic)
        except Exception as e:
            print("❌ GitHub error:", e)

        return jsonify({
            "youtube_videos": youtube_videos,
            "coursera_courses": coursera_courses,
            "github_repos": github_repos
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Roadmap API
@main.route("/api/roadmap", methods=["GET"])
def get_roadmap():
    topic = request.args.get("topic", "")
    if not topic:
        return jsonify({"error": "No topic provided"}), 400
    roadmap = generate_roadmap(topic)
    return jsonify({"roadmap": roadmap})

# ✅ Interview Q&A from Resume Upload (with user ID)
@main.route("/api/interview_questions", methods=["POST"])
def interview_questions():
    if "resume" not in request.files or "user_id" not in request.form:
        return jsonify({"error": "Missing resume or user ID"}), 400

    user_id = request.form["user_id"]
    file = request.files["resume"]
    filename = secure_filename(file.filename)
    filepath = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    try:
        resume_text = extract_text_from_resume(filepath)
        print("📄 Resume Content:\n", resume_text[:500])  # Debug print for verification
        # If extraction failed, return a clear 400 instead of a generic network error on client
        if isinstance(resume_text, str) and resume_text.startswith("Error reading resume:"):
            return jsonify({"error": resume_text}), 400

        save_resume_text(user_id, resume_text)  # ✅ Store for future use
        qa = generate_interview_questions(resume_text)
        return jsonify({"questions": qa})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Generate Q&A from raw resume text (Blueprint route)
@main.route("/api/generate-questions", methods=["POST"])
def generate_questions_from_text():
    data = request.get_json()
    if not data or "resume_text" not in data:
        return jsonify({"error": "Missing resume_text in request"}), 400

    try:
        qa_pairs = generate_interview_questions(data["resume_text"])
        return jsonify({"qaPairs": qa_pairs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Generate Q&A using "resumeText" (Blueprint route)
@main.route("/api/interview", methods=["POST"])
def generate_questions_blueprint():
    try:
        data = request.get_json()
        if not data or "resumeText" not in data:
            return jsonify({"error": "Missing resumeText in request"}), 400

        resume_text = data["resumeText"]
        print("🔍 Flask route - resumeText length:", len(resume_text))
        print("🔍 Flask route - GROQ_API_KEY set:", bool(os.getenv("GROQ_API_KEY")))
        qa_pairs = generate_interview_questions(resume_text)
        print("🔍 Flask route - qa_pairs returned:", len(qa_pairs) if qa_pairs else 0)
        if qa_pairs and len(qa_pairs) > 0:
            print("🔍 Flask route - first pair has answer:", bool(qa_pairs[0].get("answer")))
        return jsonify({"qaPairs": qa_pairs})
    except Exception as e:
        print("🔍 Flask route - exception:", str(e))
        return jsonify({"error": str(e)}), 500

# ✅ Retrieve Saved Resume
@main.route("/api/saved_resume", methods=["GET"])
def get_saved():
    user_id = request.args.get("user_id", "")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    resume_text = get_saved_resume(user_id)
    if not resume_text:
        return jsonify({"error": "No saved resume found"}), 404

    return jsonify({"resume": resume_text})


# ✅ NEW: Raw Flask route (not inside Blueprint)
@app.route("/generate-questions", methods=["POST"])
def generate_questions_simple():
    try:
        resume_text = request.json.get("resumeText")
        qa_pairs = generate_interview_questions(resume_text)
        return jsonify(qa_pairs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Register Blueprint
app.register_blueprint(main)
