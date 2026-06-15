from jose import jwt

from app.core.security import (
    SECRET_KEY,
    ALGORITHM,
    hash_password,
    verify_password,
    create_access_token,
)


class TestHashPassword:
    def test_returns_hashed_string(self):
        hashed = hash_password("mypassword")
        assert hashed != "mypassword"
        assert isinstance(hashed, str)

    def test_different_calls_produce_different_hashes(self):
        h1 = hash_password("same")
        h2 = hash_password("same")
        assert h1 != h2


class TestVerifyPassword:
    def test_correct_password(self):
        hashed = hash_password("secret")
        assert verify_password("secret", hashed) is True

    def test_wrong_password(self):
        hashed = hash_password("secret")
        assert verify_password("wrong", hashed) is False


class TestCreateAccessToken:
    def test_returns_valid_jwt(self):
        token = create_access_token({"user_id": 1, "role": "customer"})
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["user_id"] == 1
        assert payload["role"] == "customer"
        assert "exp" in payload

    def test_custom_expiry(self):
        token = create_access_token({"user_id": 2}, expires_minutes=5)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["user_id"] == 2
        assert "exp" in payload

    def test_does_not_mutate_input(self):
        data = {"user_id": 3}
        create_access_token(data)
        assert "exp" not in data
