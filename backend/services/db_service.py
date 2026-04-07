from sqlmodel import Session, select
from models.database import Users, Quizzes, Questions, Options, Attempt, UserAnswerHistory, UserQuotas
from typing import List, Optional
import uuid
from datetime import datetime

def get_or_create_user(session: Session, user_id: str, email: str) -> Users:
    user = session.get(Users, user_id)
    if not user:
        user = Users(id=user_id, email=email)
        session.add(user)
        # Create initial quota
        quota = UserQuotas(user_id=user_id, quota_remaining=50)
        session.add(quota)
        session.commit()
        session.refresh(user)
    return user

def save_generated_quiz(session: Session, user_id: str, quiz_data: dict) -> Quizzes:
    # quiz_data structure matches GeneratedQuizResponse in schemas.py
    new_quiz = Quizzes(
        user_id=user_id,
        title=quiz_data.get("title", "Untitled Quiz"),
        difficulty=quiz_data.get("difficulty", "easy")
    )
    session.add(new_quiz)
    session.flush() # Get quiz ID

    for q_data in quiz_data.get("questions", []):
        question = Questions(
            quiz_id=new_quiz.id,
            content=q_data.get("text"),
            explanation=q_data.get("explanation"),
            type=q_data.get("type", "mcq")
        )
        session.add(question)
        session.flush()

        for idx, opt_text in enumerate(q_data.get("options", [])):
            is_correct = (idx == q_data.get("correctIndex"))
            # For T/F, correctIndex logic still holds if options are ['True', 'False']
            option = Options(
                question_id=question.id,
                content=opt_text,
                is_correct=is_correct
            )
            session.add(option)
    
    session.commit()
    session.refresh(new_quiz)
    return new_quiz

def list_user_quizzes(session: Session, user_id: str) -> List[Quizzes]:
    statement = select(Quizzes).where(Quizzes.user_id == user_id).order_by(Quizzes.created_time.desc())
    return session.exec(statement).all()

def get_quiz_by_id(session: Session, quiz_id: uuid.UUID) -> Optional[Quizzes]:
    return session.get(Quizzes, quiz_id)

def start_attempt(session: Session, user_id: str, quiz_id: uuid.UUID) -> Attempt:
    attempt = Attempt(user_id=user_id, quiz_id=quiz_id)
    session.add(attempt)
    session.commit()
    session.refresh(attempt)
    return attempt

def complete_attempt(session: Session, attempt_id: uuid.UUID, score: int, answers: List[dict]) -> Attempt:
    attempt = session.get(Attempt, attempt_id)
    if not attempt:
        return None
    
    attempt.score = score
    attempt.status = "completed"
    attempt.end_time = datetime.utcnow()
    
    # Save answers history
    for ans in answers:
        # ans: {"question_id": int, "option_id": int}
        history = UserAnswerHistory(
            attempt_id=attempt_id,
            question_id=ans.get("question_id"),
            option_id=ans.get("option_id")
        )
        session.add(history)
        
    session.commit()
    session.refresh(attempt)
    return attempt
