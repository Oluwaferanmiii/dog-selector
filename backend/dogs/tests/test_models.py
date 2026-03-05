import pytest
from dogs.models import Breed, Description, Dog

pytestmark = pytest.mark.django_db


def test_dog_defaults():
    breed = Breed.objects.create(name="Beagle")
    desc = Description.objects.create(text="Friendly")
    dog = Dog.objects.create(breed=breed, description=desc)

    assert dog.status == Dog.Status.PENDING
    assert dog.rating == 0
    assert dog.note == ""


def test_dog_str():
    breed = Breed.objects.create(name="Beagle")
    desc = Description.objects.create(text="Friendly")
    dog = Dog.objects.create(
        breed=breed, description=desc, status=Dog.Status.ACCEPTED)
    s = str(dog)

    assert "Beagle" in s
    assert "Friendly" in s
    assert "accepted" in s
