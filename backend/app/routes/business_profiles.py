from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.auth import get_current_user
from app.core.roles import require_business
from app.models.business_profile import BusinessProfile
from app.schemas.business_profile import BusinessProfileCreate

router = APIRouter(tags=["Business Profiles"])


@router.post("/business-profile")
def create_profile(
    profile: BusinessProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_business(current_user)
    
    existing = (
        db.query(BusinessProfile)
        .filter(BusinessProfile.user_id == current_user.id)
        .first()
    )
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Business profile already exists for this user"
        )
    
    business = BusinessProfile(
        user_id=current_user.id,
        business_name=profile.business_name,
        category=profile.category,
        description=profile.description,
        logo=profile.logo,
    )

    db.add(business)
    db.commit()
    db.refresh(business)

    return business


@router.get("/business-profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    profile = (
        db.query(BusinessProfile)
        .filter(BusinessProfile.user_id == current_user.id)
        .first()
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Business profile not found"
        )
    
    return profile


@router.get("/business-profile/{user_id}")
def get_business_profile_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    profile = (
        db.query(BusinessProfile)
        .filter(BusinessProfile.user_id == user_id)
        .first()
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Business profile not found"
        )
    
    return profile


@router.put("/business-profile")
def update_profile(
    profile_data: BusinessProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    require_business(current_user)
    
    profile = (
        db.query(BusinessProfile)
        .filter(BusinessProfile.user_id == current_user.id)
        .first()
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Business profile not found"
        )
    
    profile.business_name = profile_data.business_name
    profile.category = profile_data.category
    profile.description = profile_data.description
    profile.logo = profile_data.logo
    
    db.commit()
    db.refresh(profile)
    
    return profile
