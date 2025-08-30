import os
import re
from groq import Groq
from PyPDF2 import PdfReader
from docx import Document

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

def generate_interview_questions(resume_text: str):
    """
    Generate interview questions using Groq API
    """
    if not resume_text.strip():
        return ["No resume text found. Please upload a valid file."]

    try:
        # Fast-fail if API key is missing to avoid network/auth errors
        if not os.getenv("GROQ_API_KEY"):
            print("❌ GROQ_API_KEY not found in environment")
            return _get_fallback_questions(resume_text)
        else:
            print("✅ GROQ_API_KEY found:", os.getenv("GROQ_API_KEY")[:10] + "...")
        # Initialize Groq client with current environment
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        # Truncate overly long resumes to avoid oversized payloads/timeouts
        max_chars = int(os.getenv("RESUME_MAX_CHARS", "6000"))
        text_for_prompt = (resume_text[:max_chars]).strip()
        # Prompt (refined to ensure exactly 10 Q&A pairs and concise formatting)
        prompt = f"""
You are an experienced technical interviewer.
Carefully read the candidate’s resume below and generate exactly 10 high-quality interview questions that match their projects, skills, and experience.

For each question, also generate a 150-300 sentence sample answer based only on the resume.

Strict output format (no extra commentary):
Q1: <question>
A1: <answer spanning multiple lines if needed>
Q2: <question>
A2: <answer>
...
Q10: <question>
A10: <answer>

Resume content:
{text_for_prompt}
"""

        try:
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1500,
            )
        except Exception as api_error:
            print("❌ Groq API call failed:", str(api_error))
            return _get_fallback_questions(resume_text)

        # Extract reply text
        result = response.choices[0].message.content.strip()
        print("🔍 Groq API response length:", len(result))
        print("🔍 First 200 chars of response:", result[:200])
        # Parse Q&A pairs properly
        lines = [ln.strip() for ln in result.split("\n")]
        qa_pairs = []
        current_q = ""
        current_a = []
        in_answer = False

        question_re = re.compile(r"^Q\s*\d+\s*:\s*(.*)$", re.IGNORECASE)
        answer_re = re.compile(r"^A\s*\d+\s*:\s*(.*)$", re.IGNORECASE)

        for raw in lines:
            if not raw:
                continue
            q_match = question_re.match(raw)
            a_match = answer_re.match(raw)

            if q_match:
                # Flush previous
                if current_q and current_a:
                    qa_pairs.append({"question": current_q, "answer": " ".join(current_a).strip()})
                current_q = q_match.group(1).strip()
                current_a = []
                in_answer = False
                continue

            if a_match:
                in_answer = True
                current_a.append(a_match.group(1).strip())
                continue

            # Continuation lines (part of the current answer)
            if in_answer:
                current_a.append(raw)

        # Add the final pair if present
        if current_q and current_a:
            qa_pairs.append({"question": current_q, "answer": " ".join(current_a).strip()})

        print("🔍 Parsed Q&A pairs:", len(qa_pairs))
        if qa_pairs:
            print("🔍 First pair - Q:", qa_pairs[0].get("question", "")[:50])
            print("🔍 First pair - A:", qa_pairs[0].get("answer", "")[:50])
        # If parsing failed, return the raw text split by lines
        if not qa_pairs:
            print("🔍 Parsing failed, returning raw lines")
            return lines
        
        return qa_pairs

    except Exception as e:
        print("Groq API error:", str(e))
        return _get_fallback_questions(resume_text)

def _get_fallback_questions(resume_text: str) -> list:
    """
    Generate template questions when API is unavailable
    """
    # Extract skills and projects from resume text
    skills = []
    projects = []
    
    # Simple keyword extraction
    text_lower = resume_text.lower()
    if "python" in text_lower:
        skills.append("Python")
    if "flask" in text_lower:
        skills.append("Flask")
    if "react" in text_lower:
        skills.append("React")
    if "machine learning" in text_lower or "ml" in text_lower:
        skills.append("Machine Learning")
    if "sql" in text_lower:
        skills.append("SQL")
    
    # Extract project mentions
    if "project" in text_lower:
        projects = ["AI Travel Planner", "AI Study Planner", "Resume Analyzer"]
    
    qa_pairs = [
        {
            "question": "Can you walk me through your most challenging project?",
            "answer": "Based on your resume, you've worked on several AI projects including an AI Travel Planner and AI Study Planner. These projects likely involved complex problem-solving and technical implementation challenges."
        },
        {
            "question": "What technologies did you use in your recent projects?",
            "answer": "From your resume, I can see you've used Python, Flask, SQL, Machine Learning, and React. These technologies demonstrate a full-stack development approach."
        },
        {
            "question": "How do you handle debugging and troubleshooting?",
            "answer": "Your experience with multiple projects suggests you've developed systematic debugging approaches. This is crucial for maintaining and improving complex applications."
        },
        {
            "question": "Describe a time you had to learn a new technology quickly.",
            "answer": "Your diverse skill set shows you're capable of learning new technologies efficiently. This adaptability is valuable in fast-paced development environments."
        },
        {
            "question": "What are your career goals in the next 2-3 years?",
            "answer": "Based on your AI and full-stack development experience, you likely aim to advance in software engineering, possibly specializing in AI/ML applications or full-stack development."
        }
    ]
    
    # Add skill-specific Q&A if skills detected
    if skills:
        qa_pairs.append({
            "question": f"What's your experience level with {skills[0]}?",
            "answer": f"Your resume shows experience with {skills[0]}, which is evident from your project implementations and technical skills."
        })
    
    return qa_pairs

def extract_text_from_resume(file_path: str) -> str:
    """
    Extract plain text from a resume file. Supports PDF, DOCX, and TXT.
    """
    try:
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        max_pages = int(os.getenv("RESUME_MAX_PAGES", "5"))
        max_chars = int(os.getenv("RESUME_MAX_CHARS", "6000"))

        if ext == ".pdf":
            text_chunks = []
            with open(file_path, "rb") as file_stream:
                pdf_reader = PdfReader(file_stream)
                for page in pdf_reader.pages[:max_pages]:
                    page_text = page.extract_text() or ""
                    text_chunks.append(page_text)
            return ("\n".join(text_chunks).strip())[:max_chars]

        if ext == ".docx":
            document = Document(file_path)
            return ("\n".join(p.text for p in document.paragraphs).strip())[:max_chars]

        # Fallback: treat as plain text
        with open(file_path, "r", encoding="utf-8", errors="ignore") as text_file:
            return (text_file.read().strip())[:max_chars]
    except Exception as error:
        return f"Error reading resume: {error}"
