from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import asc

from app.core.dependencies import get_db
from app.core.auth import get_current_user
from app.core.roles import require_business
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter()

# CREATE PRODUCT
@router.post("/products", response_model=ProductOut)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_business(current_user)

    new_product = Product(
        **product.model_dump(),
        seller_id=current_user.id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# GET ALL PRODUCTS
@router.get("/products")
def get_products(
    search: str | None = None,
    category: str | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if search:
        query = query.filter(
            Product.title.ilike(f"%{search}%")
        )

    if category:
        query = query.filter(
            Product.category == category
        )

    if sort == "price":
        query = query.order_by(
            asc(Product.price)
        )

    return query.all()


# GET SINGLE PRODUCT
@router.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# UPDATE PRODUCT
@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_business(current_user)
    
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own products"
        )

    for key, value in product_data.model_dump().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# DELETE PRODUCT
@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    require_business(current_user)
    
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own products"
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}
