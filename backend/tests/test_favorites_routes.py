class TestAddFavorite:
    def test_add_favorite(self, client, customer_user, sample_product):
        resp = client.post("/favorites", json={
            "product_id": sample_product["id"],
        }, headers=customer_user["headers"])
        assert resp.status_code == 200
        assert "Added" in resp.json()["message"]

    def test_duplicate_favorite(self, client, customer_user, sample_product):
        pid = sample_product["id"]
        client.post("/favorites", json={"product_id": pid},
                     headers=customer_user["headers"])
        resp = client.post("/favorites", json={"product_id": pid},
                           headers=customer_user["headers"])
        assert resp.status_code == 400
        assert "already" in resp.json()["detail"].lower()

    def test_unauthenticated_cannot_add(self, client, sample_product):
        resp = client.post("/favorites", json={
            "product_id": sample_product["id"],
        })
        assert resp.status_code in (401, 403)


class TestGetFavorites:
    def test_get_favorites_empty(self, client, customer_user):
        resp = client.get("/favorites", headers=customer_user["headers"])
        assert resp.status_code == 200
        assert resp.json() == []

    def test_get_favorites_with_items(self, client, customer_user, sample_product):
        client.post("/favorites", json={"product_id": sample_product["id"]},
                     headers=customer_user["headers"])
        resp = client.get("/favorites", headers=customer_user["headers"])
        assert resp.status_code == 200
        assert len(resp.json()) == 1

    def test_favorites_are_user_scoped(self, client, customer_user, business_user, sample_product):
        client.post("/favorites", json={"product_id": sample_product["id"]},
                     headers=customer_user["headers"])
        resp = client.get("/favorites", headers=business_user["headers"])
        assert resp.status_code == 200
        assert len(resp.json()) == 0


class TestDeleteFavorite:
    def test_delete_favorite(self, client, customer_user, sample_product):
        client.post("/favorites", json={"product_id": sample_product["id"]},
                     headers=customer_user["headers"])
        favs = client.get("/favorites", headers=customer_user["headers"]).json()
        fav_id = favs[0]["id"]

        resp = client.delete(f"/favorites/{fav_id}",
                             headers=customer_user["headers"])
        assert resp.status_code == 200
        assert "Removed" in resp.json()["message"]

    def test_delete_nonexistent_favorite(self, client, customer_user):
        resp = client.delete("/favorites/9999",
                             headers=customer_user["headers"])
        assert resp.status_code == 404

    def test_cannot_delete_other_users_favorite(self, client, customer_user, business_user, sample_product):
        client.post("/favorites", json={"product_id": sample_product["id"]},
                     headers=customer_user["headers"])
        favs = client.get("/favorites", headers=customer_user["headers"]).json()
        fav_id = favs[0]["id"]

        resp = client.delete(f"/favorites/{fav_id}",
                             headers=business_user["headers"])
        assert resp.status_code == 404
