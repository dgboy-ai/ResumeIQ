import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    
async def analyze_resume_text(text: str, metadata: dict = {}) -> dict:
    if not API_KEY:
        return _mock_resume_analysis()
    
    meta_info = f"Metadata: {metadata}" if metadata else ""
    
    # Ensure text is treated as a string for slicing
    clean_text = str(text)[:10000]
    
    prompt = f"""
    Act as a Senior Tech Recruiter. Analyze this resume:
    {meta_info}
    
    Return ONLY a JSON object with this structure. Be extremely concise.
    {{
        "score": 0.0,
        "score_explanation": "",
        "score_breakdown": {{"skills_coverage": 0, "project_quality": 0, "ats_compatibility": 0, "experience_depth": 0, "structure": 0}},
        "strengths": [], "weaknesses": [], "improvements": [],
        "bullet_point_rewrites": [{{"original": "", "improved": ""}}],
        "impact_score": 0.0, "keywords": [], "skills": [],
        "market_demand": [{{"skill": "", "demand": "High"}}],
        "interview_prep": {{"technical": [], "projects": [], "behavioral": []}},
        "ats_analysis": {{"score": 0, "missing_keywords": [], "formatting_issues": [], "section_completeness": 0}},
        "recruiter_perspective": {{"verdict": "", "pros": [], "cons": [], "overall_impression": ""}},
        "insights": {{"clarity": 0, "technical_depth": 0, "industry_readiness": 0, "recruiter_friendliness": 0, "project_quality": 0, "communication_clarity": 0}},
        "distribution": {{"technical": 0, "soft_skills": 0, "leadership": 0, "experience": 0}}
    }}

    RESUME TEXT:
    {clean_text}
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        resp_text = response.text
        
        import re
        json_match = re.search(r'\{.*\}', resp_text, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())
                base = _mock_resume_analysis()
                
                # DEEP MERGE to ensure UI doesn't break if AI misses keys
                for key, value in data.items():
                    if isinstance(key, str) and key in base:
                        base_val = base[key]
                        if isinstance(value, dict) and isinstance(base_val, dict):
                            base_val.update(value)
                        else:
                            base[key] = value
                return base
            except:
                return _mock_resume_analysis()
        return _mock_resume_analysis()
    except Exception as e:
        print(f"AI Error: {e}")
        return _mock_resume_analysis()
        
async def generate_summary_text(text: str) -> str:
    if not API_KEY:
        return "Seasoned software professional with expertise in building scalable cloud-native applications. Strong focus on backend architecture, performance optimization, and cross-functional leadership."
    
    prompt = f"""
    Generate a high-impact, professional summary (2-3 lines) that highlights the candidate's unique value proposition.
    
    Resume Text:
    {text}
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return "Experienced professional with a strong background in software engineering and a passion for building scalable solutions."

async def match_job_role(text: str, job_role: str) -> dict:
    if not API_KEY:
        return _mock_job_match(job_role)
    
    prompt = f"""
    Compare the following resume to the target job role: '{job_role}'.
    Provide a structured JSON response exactly matching these keys:
    - "match_percentage": A number between 0 and 100 representing the fit.
    - "missing_skills": A list of skills the candidate is missing for this role.
    - "recommended_improvements": A list of suggestions to improve chances for this role.
    - "suggested_certifications": A list of suggested certifications or tech to learn.
    - "career_gap_analysis": (string) A brief overview of the gap between current state and target role.
    - "learning_path": {{
        "technologies": (list),
        "certifications": (list),
        "tools": (list)
      }}
    
    Resume Text:
    {text}
    
    Output strictly as JSON.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        resp_text = response.text
        import re
        json_match = re.search(r'\{.*\}', resp_text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            base = _mock_job_match(job_role)
            base.update(data)
            return base
        else:
            return _mock_job_match(job_role)
    except Exception as e:
        print(f"Error calling API: {e}")
        return _mock_job_match(job_role)
        
def _mock_resume_analysis():
    return {
        "score": 8.4,
        "score_explanation": "The resume scores high due to strong technical keyword density and clear impact-driven bullet points. However, it lacks quantified metrics in some areas, which prevents it from reaching a perfect 10.",
        "score_breakdown": {
            "skills_coverage": 85,
            "project_quality": 82,
            "ats_compatibility": 92,
            "experience_depth": 78,
            "structure": 90
        },
        "strengths": ["Advanced Tech Stack", "Consistent Career Growth", "Strong Project Impact"],
        "weaknesses": ["Low Keyword Coverage for Soft Skills", "Under-explained Research Work"],
        "improvements": [
            "Quantify results in the Professional Experience section using metrics (%, $, time).",
            "Add Cloud Orchestration keywords like Kubernetes and Terraform.",
            "Expand on leadership contributions and team collaboration."
        ],
        "bullet_point_rewrites": [
            {
                "original": "Built a web application using Python.",
                "improved": "Architected and deployed a highly-available web platform using Python and FastAPI, reducing API latency by 45% for 10k+ monthly active users."
            },
            {
                "original": "Worked on machine learning models.",
                "improved": "Engineered end-to-end ML pipelines using Scikit-learn and TensorFlow, boosting model predictive accuracy from 72% to 89% via hyperparameter optimization."
            }
        ],
        "impact_score": 8.1,
        "keywords": ["Python", "FastAPI", "React", "Docker", "AWS", "CI/CD", "System Design"],
        "skills": ["Backend Development", "Cloud Architecture", "Frontend Performance", "RESTful APIs", "NoSQL Databases"],
        "market_demand": [
            {"skill": "Python", "demand": "Very High"},
            {"skill": "FastAPI", "demand": "High"},
            {"skill": "React", "demand": "Very High"},
            {"skill": "Docker", "demand": "High"}
        ],
        "interview_prep": {
            "technical": [
                "How would you optimize a slow database query in a FastAPI environment?",
                "Explain the difference between vertical and horizontal scaling in the context of your Dockerized microservices.",
                "What strategies do you use for managing state in a complex React application?"
            ],
            "projects": [
                "What was the most challenging technical hurdle in your impact-driven project, and how did you overcome it?",
                "How did you ensure the security of the RESTful APIs you developed?"
            ],
            "behavioral": [
                "Describe a time you had to learn a complex technology quickly to meet a deadline.",
                "How do you handle technical disagreements within a development team?"
            ]
        },
        "ats_analysis": {
            "score": 92,
            "missing_keywords": ["Kubernetes", "Microservices", "Unit Testing"],
            "formatting_issues": ["None detected - highly compatible"],
            "section_completeness": 95
        },
        "recruiter_perspective": {
            "verdict": "Highly Likely",
            "pros": ["Direct experience with relevant tech stack", "Prestigious project contributions"],
            "cons": ["Brief gaps in employment could be explained better"],
            "overall_impression": "A technically solid candidate who demonstrates maturity and a clear understanding of modern high-scale engineering."
        },
        "insights": {
            "clarity": 9.0,
            "technical_depth": 8.5,
            "industry_readiness": 8.8,
            "recruiter_friendliness": 9.2,
            "project_quality": 8.2,
            "communication_clarity": 8.9
        },
        "distribution": {
            "technical": 9.2,
            "soft_skills": 6.8,
            "leadership": 7.5,
            "experience": 8.4
        }
    }

def _mock_job_match(job_role: str):
    return {
        "match_percentage": 78,
        "missing_skills": ["Golang", "In-depth Kubernetes", "GraphQL"],
        "recommended_improvements": ["Build a small project using Golang", "Get hands-on experience with EKS or GKE"],
        "suggested_certifications": ["CKAD", "AWS Developer Associate"],
        "career_gap_analysis": "Transitioning to a Senior Role requires more focus on distributed systems and cloud-native orchestration tools like Kubernetes.",
        "learning_path": {
            "technologies": ["Golang", "Kubernetes", "Terraform"],
            "certifications": ["Google Cloud Professional Cloud Architect", "HashiCorp Certified: Terraform Associate"],
            "tools": ["Helm", "Prometheus", "Grafana"]
        }
    }
