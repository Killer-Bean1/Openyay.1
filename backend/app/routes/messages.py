from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.dependencies import get_db
from app.core.auth import get_current_user
from app.models.message import Message
from app.schemas.message import MessageCreate

router = APIRouter(tags=["Messages"])


@router.post("/messages")
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        content=message.content,
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {"message": "Message sent", "data": new_message}


@router.get("/messages")
def get_messages(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    messages = (
        db.query(Message)
        .filter(
            Message.receiver_id == current_user.id
        )
        .all()
    )

    return messages


@router.get("/messages/conversation/{user_id}")
def get_conversation(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    messages = (
        db.query(Message)
        .filter(
            or_(
                (Message.sender_id == current_user.id) & (Message.receiver_id == user_id),
                (Message.sender_id == user_id) & (Message.receiver_id == current_user.id)
            )
        )
        .order_by(Message.timestamp)
        .all()
    )

    return messages


@router.delete("/messages/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    message = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found"
        )

    if message.sender_id != current_user.id and message.receiver_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own messages"
        )

    db.delete(message)
    db.commit()

    return {"message": "Message deleted"}
