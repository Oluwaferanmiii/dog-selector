import pytest
from contact.serializers import ContactSubmissionSerializer

pytestmark = pytest.mark.django_db


def test_contact_serializer_valid():
    serializer = ContactSubmissionSerializer(
        data={"name": "A", "email": "a@test.com", "message": "Hi"}
    )
    assert serializer.is_valid() is True
