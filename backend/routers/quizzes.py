from fastapi import APIRouter, HTTPException, Depends
from models.schemas import GenerateQuizRequest, APIResponse, GeneratedQuizResponse
from services.ai_service import generate_quiz_from_prompt
from services import db_service
from models.database import get_session
from sqlmodel import Session
from datetime import datetime
from typing import List
import uuid

router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"],
)

@router.post("/generate", response_model=APIResponse)
async def generate_quiz(request: GenerateQuizRequest, session: Session = Depends(get_session)):
    """
    API endpoint that receives a prompt from the frontend and returns an AI-generated Quiz,
    saving it to the database for the given user.
    """
    if not request.topic or len(request.topic.strip()) < 3:
         raise HTTPException(status_code=400, detail="Topic is too short or empty.")
         
    # Ensure user exists (Clerk ID placeholder logic)
    # In practice, get email from JWT or request
    db_service.get_or_create_user(session, request.user_id, email=f"{request.user_id}@example.com")

    # Call AI to generate JSON format
    ai_response = await generate_quiz_from_prompt(request.topic, request.count)
    
    if ai_response.get("status") == "error":
        raise HTTPException(status_code=400, detail=ai_response.get("message", "AI refused to process this topic."))
        
    try:
        quiz_data = ai_response.get("data")
        # Save to database
        db_quiz = db_service.save_generated_quiz(session, request.user_id, quiz_data)
        
        # Prepare response
        return APIResponse(
            status="success", 
            data=GeneratedQuizResponse(
                id=str(db_quiz.id),
                title=db_quiz.title,
                difficulty=db_quiz.difficulty,
                createdAt=db_quiz.created_time.isoformat(),
                questionCount=len(db_quiz.questions),
                description=quiz_data.get("description", ""),
                tags=quiz_data.get("tags", []),
                questions=quiz_data.get("questions", [])
            )
        )
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Error saving quiz to database: {str(e)}")

@router.get("/", response_model=List[GeneratedQuizResponse])
async def list_quizzes(user_id: str, session: Session = Depends(get_session)):
    """List all quizzes for a specific user."""
    quizzes = db_service.list_user_quizzes(session, user_id)
    return [
        GeneratedQuizResponse(
            id=str(q.id),
            title=q.title,
            difficulty=q.difficulty,
            createdAt=q.created_time.isoformat(),
            questionCount=len(q.questions),
            description="", # Could be added to DB if needed
            tags=[],
            questions=[] # Don't return all questions in list view for performance
        ) for q in quizzes
    ]

@router.get("/{quiz_id}", response_model=GeneratedQuizResponse)
async def get_quiz(quiz_id: uuid.UUID, session: Session = Depends(get_session)):
    """Get full details of a specific quiz."""
    quiz = db_service.get_quiz_by_id(session, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    return GeneratedQuizResponse(
        id=str(quiz.id),
        title=quiz.title,
        difficulty=quiz.difficulty,
        createdAt=quiz.created_time.isoformat(),
        questionCount=len(quiz.questions),
        description="",
        tags=[],
        questions=[{
            "id": q.id,
            "text": q.content,
            "type": q.type,
            "explanation": q.explanation,
            "options": [o.content for o in q.options],
            "correctIndex": next((i for i, o in enumerate(q.options) if o.is_correct), 0)
        } for q in quiz.questions]
    )
