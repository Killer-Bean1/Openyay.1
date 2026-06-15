class TestCreateProduct:
    def test_business_can_create(self, client, business_user):
        resp = client.post("/products", json={
            "title": "Gadget",
            "description": "Cool gadget",
            "price": 49.99,
            "category": "electronics",
            "inventory": 5,
        }, headers=business_user["headers"])
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Gadget"
        assert data["price"] == 49.99

    def test_customer_cannot_create(self, client, customer_user):
        resp = client.post("/products", json={
            "title": "Gadget",
            "price": 49.99,
        }, headers=customer_user["headers"])
        assert resp.status_code == 403

    def test_unauthenticated_cannot_create(self, client):
        resp = client.post("/products", json={
            "title": "Gadget",
            "price": 49.99,
        })
        assert resp.status_code in (401, 403)

    def test_missing_required_fields(self, client, business_user):
        resp = client.post("/products", json={
            "description": "No title or price",
        }, headers=business_user["headers"])
        assert resp.status_code == 422


class TestGetProducts:
    def test_get_all_products(self, client, sample_product):
        resp = client.get("/products")
        assert resp.status_code == 200
        products = resp.json()
        assert len(products) >= 1

    def test_empty_product_list(self, client):
        resp = client.get("/products")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_search_by_title(self, client, sample_product):
        resp = client.get("/products", params={"search": "Widget"})
        assert resp.status_code == 200
        assert len(resp.json()) == 1

    def test_search_no_match(self, client, sample_product):
        resp = client.get("/products", params={"search": "nonexistent"})
        assert resp.status_code == 200
        assert len(resp.json()) == 0

    def test_filter_by_category(self, client, sample_product):
        resp = client.get("/products", params={"category": "electronics"})
        assert resp.status_code == 200
        assert len(resp.json()) == 1

    def test_filter_by_wrong_category(self, client, sample_product):
        resp = client.get("/products", params={"category": "clothing"})
        assert resp.status_code == 200
        assert len(resp.json()) == 0

    def test_sort_by_price(self, client, business_user):
        client.post("/products", json={
            "title": "Expensive", "price": 100.0,
        }, headers=business_user["headers"])
        client.post("/products", json={
            "title": "Cheap", "price": 5.0,
        }, headers=business_user["headers"])
        resp = client.get("/products", params={"sort": "price"})
        prices = [p["price"] for p in resp.json()]
        assert prices == sorted(prices)


class TestGetSingleProduct:
    def test_get_existing_product(self, client, sample_product):
        pid = sample_product["id"]
        resp = client.get(f"/products/{pid}")
        assert resp.status_code == 200
        assert resp.json()["title"] == "Test Widget"

    def test_get_nonexistent_product(self, client):
        resp = client.get("/products/9999")
        assert resp.status_code == 404


class TestUpdateProduct:
    def test_owner_can_update(self, client, business_user, sample_product):
        pid = sample_product["id"]
        resp = client.put(f"/products/{pid}", json={
            "title": "Updated Widget",
            "description": "Updated desc",
            "price": 39.99,
            "category": "electronics",
            "inventory": 20,
        }, headers=business_user["headers"])
        assert resp.status_code == 200
        assert resp.json()["title"] == "Updated Widget"
        assert resp.json()["price"] == 39.99

    def test_non_owner_cannot_update(self, client, sample_product):
        # Register a second business user
        client.post("/auth/register", json={
            "full_name": "Other Biz",
            "email": "other@biz.com",
            "password": "pass1234",
            "role": "business",
        })
        resp = client.post("/auth/login", json={
            "email": "other@biz.com",
            "password": "pass1234",
        })
        other_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        pid = sample_product["id"]
        resp = client.put(f"/products/{pid}", json={
            "title": "Hacked",
            "price": 0.01,
        }, headers=other_headers)
        assert resp.status_code == 403

    def test_update_nonexistent_product(self, client, business_user):
        resp = client.put("/products/9999", json={
            "title": "Ghost",
            "price": 1.0,
        }, headers=business_user["headers"])
        assert resp.status_code == 404


class TestDeleteProduct:
    def test_owner_can_delete(self, client, business_user, sample_product):
        pid = sample_product["id"]
        resp = client.delete(f"/products/{pid}", headers=business_user["headers"])
        assert resp.status_code == 200
        assert "deleted" in resp.json()["message"].lower()

        # Verify it's gone
        resp = client.get(f"/products/{pid}")
        assert resp.status_code == 404

    def test_non_owner_cannot_delete(self, client, sample_product):
        client.post("/auth/register", json={
            "full_name": "Other Biz",
            "email": "other2@biz.com",
            "password": "pass1234",
            "role": "business",
        })
        resp = client.post("/auth/login", json={
            "email": "other2@biz.com",
            "password": "pass1234",
        })
        other_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        pid = sample_product["id"]
        resp = client.delete(f"/products/{pid}", headers=other_headers)
        assert resp.status_code == 403

    def test_delete_nonexistent_product(self, client, business_user):
        resp = client.delete("/products/9999", headers=business_user["headers"])
        assert resp.status_code == 404

    def test_customer_cannot_delete(self, client, customer_user, sample_product):
        pid = sample_product["id"]
        resp = client.delete(f"/products/{pid}", headers=customer_user["headers"])
        assert resp.status_code == 403
