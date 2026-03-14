import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
from typing import Optional
from services.pdf_parser import extract_text_from_pdf
from services.ai_analyzer import analyze_resume_text, generate_summary_text, match_job_role
import uvicorn

app = FastAPI(title="ResumeIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads"), exist_ok=True)

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text, metadata = extract_text_from_pdf(file_path)
    return {"message": "Resume uploaded successfully", "filename": file.filename, "metadata": metadata}

@app.post("/analyze_resume")
async def analyze_resume(filename: str = Form(...)):
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    text, metadata = extract_text_from_pdf(file_path)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
    analysis = await analyze_resume_text(text, metadata)
    return analysis

@app.post("/generate_summary")
async def generate_summary(filename: str = Form(...)):
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    text, _ = extract_text_from_pdf(file_path)
    summary = await generate_summary_text(text)
    return {"summary": summary}
    

@app.post("/job_match")
async def job_match(filename: str = Form(...), job_role: str = Form(...)):
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    text, _ = extract_text_from_pdf(file_path)
    match_result = await match_job_role(text, job_role)
    return match_result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
