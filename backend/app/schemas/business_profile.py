from pydantic import BaseModel


class BusinessProfileCreate(BaseModel):
    business_name: str
    category: str
    description: str
    logo: str
