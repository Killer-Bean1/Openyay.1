import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.core.database import Base
from app.core.dependencies import get_db
from app.main import app

TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def business_user(client):
    """Register a business user and return the auth token."""
    client.post("/auth/register", json={
        "full_name": "Biz Owner",
        "email": "biz@example.com",
        "password": "password123",
        "role": "business",
    })
    resp = client.post("/auth/login", json={
        "email": "biz@example.com",
        "password": "password123",
    })
    token = resp.json()["access_token"]
    return {"token": token, "headers": {"Authorization": f"Bearer {token}"}}


@pytest.fixture()
def customer_user(client):
    """Register a customer user and return the auth token."""
    client.post("/auth/register", json={
        "full_name": "Customer Bob",
        "email": "customer@example.com",
        "password": "password123",
        "role": "customer",
    })
    resp = client.post("/auth/login", json={
        "email": "customer@example.com",
        "password": "password123",
    })
    token = resp.json()["access_token"]
    return {"token": token, "headers": {"Authorization": f"Bearer {token}"}}


@pytest.fixture()
def sample_product(client, business_user):
    """Create a sample product and return its data."""
    resp = client.post("/products", json={
        "title": "Test Widget",
        "description": "A test product",
        "price": 29.99,
        "category": "electronics",
        "image_url": "https://example.com/widget.jpg",
        "inventory": 10,
    }, headers=business_user["headers"])
    return resp.json()
