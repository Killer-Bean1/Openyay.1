import pytest
from fastapi import HTTPException
from types import SimpleNamespace

from app.core.roles import require_business


class TestRequireBusiness:
    def test_allows_business_role(self):
        user = SimpleNamespace(role="business")
        require_business(user)  # should not raise

    def test_rejects_customer_role(self):
        user = SimpleNamespace(role="customer")
        with pytest.raises(HTTPException) as exc_info:
            require_business(user)
        assert exc_info.value.status_code == 403

    def test_rejects_admin_role(self):
        user = SimpleNamespace(role="admin")
        with pytest.raises(HTTPException) as exc_info:
            require_business(user)
        assert exc_info.value.status_code == 403

    def test_rejects_empty_role(self):
        user = SimpleNamespace(role="")
        with pytest.raises(HTTPException) as exc_info:
            require_business(user)
        assert exc_info.value.status_code == 403
