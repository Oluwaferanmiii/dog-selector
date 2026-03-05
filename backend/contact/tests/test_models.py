import pytest
from contact.models import ContactSubmission

pytestmark = pytest.mark.django_db


def test_contact_submission_str():
    obj = ContactSubmission.objects.create(
        name="Feranmi",
        email="feranmiphileo@gmail.com",
        message="Hello",
    )
    assert "Feranmi" in str(obj)
    assert "feranmiphileo@gmail.com" in str(obj)
