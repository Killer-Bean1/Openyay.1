class TestSendMessage:
    def test_send_message(self, client, customer_user, business_user, db_session):
        from app.models.user import User
        receiver = db_session.query(User).filter(User.email == "biz@example.com").first()

        resp = client.post("/messages", json={
            "receiver_id": receiver.id,
            "content": "Hello seller!",
        }, headers=customer_user["headers"])
        assert resp.status_code == 200
        assert resp.json()["message"] == "Message sent"

    def test_unauthenticated_cannot_send(self, client):
        resp = client.post("/messages", json={
            "receiver_id": 1,
            "content": "Hi",
        })
        assert resp.status_code in (401, 403)

    def test_missing_fields(self, client, customer_user):
        resp = client.post("/messages", json={
            "content": "No receiver",
        }, headers=customer_user["headers"])
        assert resp.status_code == 422


class TestGetMessages:
    def test_get_inbox_empty(self, client, customer_user):
        resp = client.get("/messages", headers=customer_user["headers"])
        assert resp.status_code == 200
        assert resp.json() == []

    def test_get_inbox_with_messages(self, client, customer_user, business_user, db_session):
        from app.models.user import User
        customer = db_session.query(User).filter(User.email == "customer@example.com").first()

        client.post("/messages", json={
            "receiver_id": customer.id,
            "content": "Hey there!",
        }, headers=business_user["headers"])

        resp = client.get("/messages", headers=customer_user["headers"])
        assert resp.status_code == 200
        assert len(resp.json()) == 1
        assert resp.json()[0]["content"] == "Hey there!"


class TestGetConversation:
    def test_conversation_between_users(self, client, customer_user, business_user, db_session):
        from app.models.user import User
        biz = db_session.query(User).filter(User.email == "biz@example.com").first()
        cust = db_session.query(User).filter(User.email == "customer@example.com").first()

        client.post("/messages", json={
            "receiver_id": biz.id,
            "content": "Question about product",
        }, headers=customer_user["headers"])

        client.post("/messages", json={
            "receiver_id": cust.id,
            "content": "Sure, what is it?",
        }, headers=business_user["headers"])

        resp = client.get(f"/messages/conversation/{biz.id}",
                          headers=customer_user["headers"])
        assert resp.status_code == 200
        msgs = resp.json()
        assert len(msgs) == 2
        assert msgs[0]["content"] == "Question about product"
        assert msgs[1]["content"] == "Sure, what is it?"


class TestDeleteMessage:
    def test_sender_can_delete(self, client, customer_user, business_user, db_session):
        from app.models.user import User
        biz = db_session.query(User).filter(User.email == "biz@example.com").first()

        resp = client.post("/messages", json={
            "receiver_id": biz.id,
            "content": "Delete me",
        }, headers=customer_user["headers"])
        msg_id = resp.json()["data"]["id"]

        resp = client.delete(f"/messages/{msg_id}",
                             headers=customer_user["headers"])
        assert resp.status_code == 200
        assert "deleted" in resp.json()["message"].lower()

    def test_receiver_can_delete(self, client, customer_user, business_user, db_session):
        from app.models.user import User
        biz = db_session.query(User).filter(User.email == "biz@example.com").first()

        resp = client.post("/messages", json={
            "receiver_id": biz.id,
            "content": "Delete me too",
        }, headers=customer_user["headers"])
        msg_id = resp.json()["data"]["id"]

        resp = client.delete(f"/messages/{msg_id}",
                             headers=business_user["headers"])
        assert resp.status_code == 200

    def test_third_party_cannot_delete(self, client, customer_user, business_user, db_session):
        from app.models.user import User
        biz = db_session.query(User).filter(User.email == "biz@example.com").first()

        resp = client.post("/messages", json={
            "receiver_id": biz.id,
            "content": "Private",
        }, headers=customer_user["headers"])
        msg_id = resp.json()["data"]["id"]

        # Register a third user
        client.post("/auth/register", json={
            "full_name": "Third Party",
            "email": "third@example.com",
            "password": "pass1234",
            "role": "customer",
        })
        login_resp = client.post("/auth/login", json={
            "email": "third@example.com",
            "password": "pass1234",
        })
        third_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

        resp = client.delete(f"/messages/{msg_id}", headers=third_headers)
        assert resp.status_code == 403

    def test_delete_nonexistent_message(self, client, customer_user):
        resp = client.delete("/messages/9999",
                             headers=customer_user["headers"])
        assert resp.status_code == 404
