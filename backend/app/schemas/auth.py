from pydantic import BaseModel

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str  # customer / business
    phone_number: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str
