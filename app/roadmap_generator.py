import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

def generate_roadmap(topic: str):
    """
    Generate a learning roadmap for a given topic using Groq API
    """
    try:
        prompt = f"""
        You are an expert curriculum designer.
        Create a comprehensive, actionable learning roadmap for: {topic}.

        Requirements:
        - Organize into clear phases (Beginner, Intermediate, Advanced), each 2-4 weeks.
        - Provide 35-60 concise steps total, one per line.
        - Each step MUST be a single line: action first, then a short reason.
        - Include periodic review/milestone checks and at least 6 practical projects.
        - Cover fundamentals, core skills, applied practice, and advanced/industry topics.
        - Keep lines short (<= 160 chars) and avoid markdown code blocks.
        - Start each line with a hyphen and a space ("- ") so it is easy to render.
        """

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "Be thorough, structured, and pragmatic. Prefer concise single-line steps."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=1500,
        )

        result = response.choices[0].message.content.strip()
        # Normalize line endings and ensure one step per line
        result = "\n".join(
            [line.strip() for line in result.replace("\r\n", "\n").replace("\r", "\n").split("\n") if line.strip()]
        )
        return result

    except Exception as e:
        print("Groq API error:", str(e))
        return f"Error generating roadmap: {str(e)}"
