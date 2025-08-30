

# AI Study Planner

A web application that helps users plan and optimize their AI learning journey. It predicts study time using an external API, generates personalized roadmaps, fetches resources, and provides interview preparation tools.

## Features
- **Study Time Prediction**: Uses external AI-powered API for accurate predictions
- **Learning Roadmaps**: Generates step-by-step learning roadmaps for any AI topic
- **Resource Fetching**: Fetches resources from YouTube, Coursera, and GitHub
- **Interview Preparation**: Resume upload and interview question generation
- **User Activity Logging**: Tracks user interactions and predictions

## Project Structure
- `app/` - Flask backend code (APIs, resource fetchers, external API integration)
- `frontend/` - React frontend code with external API integration
- `data/` - User activity logs
- `uploads/` - Uploaded resumes

## External API Integration
This application uses the external study time prediction API:
- **Endpoint**: `https://study-time-predicter-api-1.onrender.com/predict`
-**GithubLink of API **:'https://github.com/SurajKothule/study-time-predicter-API.git'

- **Features**: Advanced ML model with comprehensive student data analysis
- **Response**: Predicted study time, confidence level, influencing factors, and recommendations
- **Data Format**: Uses integer values (1 for yes, 0 for no) for boolean fields

## Setup Instructions

### 1. Clone or Download the Project
Extract the zip or clone the repo:
```
git clone <your-repo-url>
cd AI_Study_Planner
```

### 2. Python Backend Setup
- Make sure you have Python 3.8+
- Create and activate a virtual environment:
  ```
  python -m venv venv
  .\venv\Scripts\activate
  ```
- Install requirements:
  ```
  pip install -r requirements.txt
  ```
- Add your API keys to a `.env` file (see `.env.example` or ask the author)
- Start the backend:
  ```
  python run.py
  ```
  The backend will run at http://127.0.0.1:5000

### 3. Frontend Setup
- Go to the frontend folder:
  ```
  cd frontend
  ```
- Install dependencies:
  ```
  npm install
  ```
- Start the frontend:
  ```
  npm start
  ```
  The frontend will run at http://localhost:3000

### 4. Usage
- Open http://localhost:3000 in your browser
- Use the dashboard to generate roadmaps, predict study time, and more
- The study time prediction uses the external API for enhanced accuracy

## API Integration
The frontend directly communicates with the external study time prediction API, providing:
- Real-time predictions
- Comprehensive student analysis
- Personalized recommendations
- Confidence scoring
