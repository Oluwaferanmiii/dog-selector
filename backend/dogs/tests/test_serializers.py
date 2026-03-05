import pytest
from dogs.models import Breed, Description, Dog
from dogs.serializers import DogSerializer

pytestmark = pytest.mark.django_db


def test_dog_serializer_includes_readonly_fields():
    breed = Breed.objects.create(name="Boxer")
    desc = Description.objects.create(text="Very playful")
    dog = Dog.objects.create(breed=breed, description=desc, rating=3)

    data = DogSerializer(dog).data
    assert data["breed_name"] == "Boxer"
    assert data["description_text"] == "Very playful"


def test_dog_serializer_rating_validation():
    breed = Breed.objects.create(name="Boxer")
    desc = Description.objects.create(text="Very playful")

    serializer = DogSerializer(
        data={
            "breed": breed.id,
            "description": desc.id,
            "status": Dog.Status.PENDING,
            "rating": 99,
            "note": "",
        }
    )
    assert serializer.is_valid() is False
    assert "rating" in serializer.errors
