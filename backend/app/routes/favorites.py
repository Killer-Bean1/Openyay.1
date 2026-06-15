from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.dependencies import get_db
from app.models.favorite import Favorite
from app.schemas.favorite import FavoriteCreate

router = APIRouter(tags=["Favorites"])


@router.post("/favorites")
def add_favorite(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.product_id == favorite.product_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Product already in favorites"
        )

    new_favorite = Favorite(
        user_id=current_user.id,
        product_id=favorite.product_id
    )

    db.add(new_favorite)
    db.commit()

    return {"message": "Added to favorites"}


@router.get("/favorites")
def get_favorites(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .all()
    )

    return favorites


@router.delete("/favorites/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.id == favorite_id,
            Favorite.user_id == current_user.id
        )
        .first()
    )

    if not favorite:
        raise HTTPException(
            status_code=404,
            detail="Favorite not found"
        )

    db.delete(favorite)
    db.commit()

    return {"message": "Removed from favorites"}
