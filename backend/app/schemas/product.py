from pydantic import BaseModel

class ProductCreate(BaseModel):
    title: str
    description: str | None = None
    price: float
    category: str | None = None
    image_url: str | None = None
    inventory: int = 0


class ProductOut(BaseModel):
    id: int
    title: str
    description: str | None
    price: float
    category: str | None
    image_url: str | None
    inventory: int

    class Config:
        from_attributes = True
