from tests.fixtures.data import ADMIN_USER_PAYLOAD, payload


def test_app_starts(client):
    """Basic health check to ensure FastAPI app runs."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_admin_fixture_created(admin_user):
    """Verify admin user fixture works."""
    assert admin_user.email == "admin@test.local"
    assert admin_user.role == "admin"


def test_payload_copy():
    """Verify payload helper returns a safe copy."""
    data = payload(ADMIN_USER_PAYLOAD)
    data["name"] = "Changed Name"

    assert ADMIN_USER_PAYLOAD["name"] == "Admin Tester"
    assert data["name"] == "Changed Name"
