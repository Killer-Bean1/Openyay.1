class TestCreateProfile:
    def test_business_can_create_profile(self, client, business_user):
        resp = client.post("/business-profile", json={
            "business_name": "Acme Corp",
            "category": "electronics",
            "description": "We sell gadgets",
            "logo": "https://example.com/logo.png",
        }, headers=business_user["headers"])
        assert resp.status_code == 200
        data = resp.json()
        assert data["business_name"] == "Acme Corp"

    def test_customer_cannot_create_profile(self, client, customer_user):
        resp = client.post("/business-profile", json={
            "business_name": "Fake Biz",
            "category": "clothing",
            "description": "Not a real business",
            "logo": "https://example.com/logo.png",
        }, headers=customer_user["headers"])
        assert resp.status_code == 403

    def test_duplicate_profile_rejected(self, client, business_user):
        payload = {
            "business_name": "Acme Corp",
            "category": "electronics",
            "description": "We sell gadgets",
            "logo": "https://example.com/logo.png",
        }
        client.post("/business-profile", json=payload,
                     headers=business_user["headers"])
        resp = client.post("/business-profile", json=payload,
                           headers=business_user["headers"])
        assert resp.status_code == 400
        assert "already exists" in resp.json()["detail"].lower()

    def test_missing_fields(self, client, business_user):
        resp = client.post("/business-profile", json={
            "business_name": "Incomplete",
        }, headers=business_user["headers"])
        assert resp.status_code == 422


class TestGetProfile:
    def test_get_own_profile(self, client, business_user):
        client.post("/business-profile", json={
            "business_name": "My Shop",
            "category": "food",
            "description": "Tasty stuff",
            "logo": "https://example.com/logo.png",
        }, headers=business_user["headers"])

        resp = client.get("/business-profile",
                          headers=business_user["headers"])
        assert resp.status_code == 200
        assert resp.json()["business_name"] == "My Shop"

    def test_get_profile_not_found(self, client, business_user):
        resp = client.get("/business-profile",
                          headers=business_user["headers"])
        assert resp.status_code == 404


class TestGetProfileByUserId:
    def test_get_profile_by_user_id(self, client, business_user, db_session):
        from app.models.user import User
        biz = db_session.query(User).filter(User.email == "biz@example.com").first()

        client.post("/business-profile", json={
            "business_name": "Public Shop",
            "category": "retail",
            "description": "Browse our stuff",
            "logo": "https://example.com/logo.png",
        }, headers=business_user["headers"])

        resp = client.get(f"/business-profile/{biz.id}")
        assert resp.status_code == 200
        assert resp.json()["business_name"] == "Public Shop"

    def test_get_profile_by_nonexistent_user(self, client):
        resp = client.get("/business-profile/9999")
        assert resp.status_code == 404


class TestUpdateProfile:
    def test_update_profile(self, client, business_user):
        client.post("/business-profile", json={
            "business_name": "Old Name",
            "category": "food",
            "description": "Old desc",
            "logo": "https://example.com/old.png",
        }, headers=business_user["headers"])

        resp = client.put("/business-profile", json={
            "business_name": "New Name",
            "category": "electronics",
            "description": "New desc",
            "logo": "https://example.com/new.png",
        }, headers=business_user["headers"])
        assert resp.status_code == 200
        assert resp.json()["business_name"] == "New Name"
        assert resp.json()["category"] == "electronics"

    def test_update_nonexistent_profile(self, client, business_user):
        resp = client.put("/business-profile", json={
            "business_name": "Ghost",
            "category": "none",
            "description": "n/a",
            "logo": "n/a",
        }, headers=business_user["headers"])
        assert resp.status_code == 404

    def test_customer_cannot_update_profile(self, client, customer_user):
        resp = client.put("/business-profile", json={
            "business_name": "Nope",
            "category": "none",
            "description": "n/a",
            "logo": "n/a",
        }, headers=customer_user["headers"])
        assert resp.status_code == 403
