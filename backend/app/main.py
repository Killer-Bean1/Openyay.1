from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes.products import router as product_router
from app.routes.auth import router as auth_router
from app.routes import favorites, messages, business_profiles
from app.models import user, favorite, message, business_profile

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(product_router)
app.include_router(auth_router)
app.include_router(favorites.router)
app.include_router(messages.router)
app.include_router(business_profiles.router)


@app.get("/")
def root():
    return {"message": "OpenYay is live"}