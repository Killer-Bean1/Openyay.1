import pytest
from pydantic import ValidationError

from app.schemas.auth import RegisterRequest, LoginRequest
from app.schemas.product import ProductCreate, ProductOut
from app.schemas.favorite import FavoriteCreate
from app.schemas.message import MessageCreate
from app.schemas.business_profile import BusinessProfileCreate


class TestRegisterRequest:
    def test_valid(self):
        r = RegisterRequest(
            full_name="Alice", email="a@b.com", password="pass", role="customer"
        )
        assert r.full_name == "Alice"

    def test_missing_field(self):
        with pytest.raises(ValidationError):
            RegisterRequest(email="a@b.com", password="pass")


class TestLoginRequest:
    def test_valid(self):
        r = LoginRequest(email="a@b.com", password="pass")
        assert r.email == "a@b.com"

    def test_missing_password(self):
        with pytest.raises(ValidationError):
            LoginRequest(email="a@b.com")


class TestProductCreate:
    def test_valid_full(self):
        p = ProductCreate(
            title="T", description="D", price=10.0,
            category="c", image_url="http://img", inventory=5,
        )
        assert p.title == "T"

    def test_valid_minimal(self):
        p = ProductCreate(title="T", price=1.0)
        assert p.description is None
        assert p.inventory == 0

    def test_missing_title(self):
        with pytest.raises(ValidationError):
            ProductCreate(price=1.0)

    def test_missing_price(self):
        with pytest.raises(ValidationError):
            ProductCreate(title="T")


class TestProductOut:
    def test_valid(self):
        p = ProductOut(
            id=1, title="T", description=None, price=10.0,
            category=None, image_url=None, inventory=0,
        )
        assert p.id == 1


class TestFavoriteCreate:
    def test_valid(self):
        f = FavoriteCreate(product_id=1)
        assert f.product_id == 1

    def test_missing_product_id(self):
        with pytest.raises(ValidationError):
            FavoriteCreate()


class TestMessageCreate:
    def test_valid(self):
        m = MessageCreate(receiver_id=1, content="Hi")
        assert m.content == "Hi"

    def test_missing_content(self):
        with pytest.raises(ValidationError):
            MessageCreate(receiver_id=1)


class TestBusinessProfileCreate:
    def test_valid(self):
        b = BusinessProfileCreate(
            business_name="Shop", category="food",
            description="Good food", logo="http://logo",
        )
        assert b.business_name == "Shop"

    def test_missing_field(self):
        with pytest.raises(ValidationError):
            BusinessProfileCreate(business_name="Shop")
