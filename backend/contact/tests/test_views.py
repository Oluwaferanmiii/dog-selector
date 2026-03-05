import pytest
from rest_framework.test import APIClient
from contact.models import ContactSubmission

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


def test_contact_create(api_client):
    res = api_client.post(
        "/api/contact/",
        {"name": "Test", "email": "test@test.com", "message": "Hello"},
        format="json",
    )
    assert res.status_code in (200, 201)
    assert ContactSubmission.objects.count() == 1
