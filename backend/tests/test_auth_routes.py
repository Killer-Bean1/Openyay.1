class TestRegister:
    def test_register_success(self, client):
        resp = client.post("/auth/register", json={
            "full_name": "Alice",
            "email": "alice@example.com",
            "password": "pass1234",
            "role": "customer",
        })
        assert resp.status_code == 200
        assert resp.json()["message"] == "User created successfully"

    def test_register_duplicate_email(self, client):
        payload = {
            "full_name": "Alice",
            "email": "dup@example.com",
            "password": "pass1234",
            "role": "customer",
        }
        client.post("/auth/register", json=payload)
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 400
        assert "already exists" in resp.json()["detail"]

    def test_register_business_user(self, client):
        resp = client.post("/auth/register", json={
            "full_name": "Shop Owner",
            "email": "shop@example.com",
            "password": "pass1234",
            "role": "business",
        })
        assert resp.status_code == 200

    def test_register_missing_fields(self, client):
        resp = client.post("/auth/register", json={"email": "no@name.com"})
        assert resp.status_code == 422


class TestLogin:
    def test_login_success(self, client):
        client.post("/auth/register", json={
            "full_name": "Bob",
            "email": "bob@example.com",
            "password": "pass1234",
            "role": "customer",
        })
        resp = client.post("/auth/login", json={
            "email": "bob@example.com",
            "password": "pass1234",
        })
        assert resp.status_code == 200
        assert "access_token" in resp.json()
        assert resp.json()["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        client.post("/auth/register", json={
            "full_name": "Bob",
            "email": "bob2@example.com",
            "password": "pass1234",
            "role": "customer",
        })
        resp = client.post("/auth/login", json={
            "email": "bob2@example.com",
            "password": "wrong",
        })
        assert resp.status_code == 400
        assert "Invalid credentials" in resp.json()["detail"]

    def test_login_nonexistent_user(self, client):
        resp = client.post("/auth/login", json={
            "email": "ghost@example.com",
            "password": "pass1234",
        })
        assert resp.status_code == 400

    def test_login_missing_fields(self, client):
        resp = client.post("/auth/login", json={"email": "a@b.com"})
        assert resp.status_code == 422


class TestMe:
    def test_me_authenticated(self, client, customer_user):
        resp = client.get("/me", headers=customer_user["headers"])
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "customer@example.com"
        assert data["role"] == "customer"

    def test_me_unauthenticated(self, client):
        resp = client.get("/me")
        assert resp.status_code in (401, 403)

    def test_me_invalid_token(self, client):
        resp = client.get("/me", headers={"Authorization": "Bearer badtoken"})
        assert resp.status_code == 401
