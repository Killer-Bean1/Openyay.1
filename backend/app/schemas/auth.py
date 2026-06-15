from pydantic import BaseModel

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str  # customer / business


class LoginRequest(BaseModel):
    email: str
    password: str
