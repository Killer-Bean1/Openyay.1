from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    category = Column(String)
    image_url = Column(String)
    seller_id = Column(Integer)
    inventory = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
