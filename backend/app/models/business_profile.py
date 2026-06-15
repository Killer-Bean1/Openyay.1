from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    business_name = Column(String)
    category = Column(String)
    description = Column(String)
    logo = Column(String)
