from fastapi import HTTPException

def require_business(user):
    if user.role != "business":
        raise HTTPException(
            status_code=403,
            detail="Only business accounts can perform this action"
        )
