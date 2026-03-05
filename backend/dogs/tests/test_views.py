import pytest
from rest_framework.test import APIClient
from dogs.models import Breed, Description, Dog

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def seeded_dogs():
    b1 = Breed.objects.create(name="Beagle")
    b2 = Breed.objects.create(name="Boxer")
    d1 = Description.objects.create(text="Friendly and energetic")
    d2 = Description.objects.create(text="Very playful")

    Dog.objects.create(breed=b1, description=d1,
                       status=Dog.Status.PENDING, rating=2)
    Dog.objects.create(breed=b2, description=d2,
                       status=Dog.Status.ACCEPTED, rating=5)
    Dog.objects.create(breed=b1, description=d2,
                       status=Dog.Status.REJECTED, rating=0)


def test_list_dogs_paginated(api_client, seeded_dogs):
    res = api_client.get("/api/dogs/?page=1&page_size=2")
    assert res.status_code == 200
    assert "results" in res.data
    assert len(res.data["results"]) == 2
    assert "count" in res.data


def test_search_dogs_by_breed_or_description(api_client, seeded_dogs):
    res = api_client.get("/api/dogs/?search=Beagle")
    assert res.status_code == 200
    assert res.data["count"] >= 1

    res2 = api_client.get("/api/dogs/?search=playful")
    assert res2.status_code == 200
    assert res2.data["count"] >= 1


def test_ordering(api_client, seeded_dogs):
    # ordering by rating ascending
    res = api_client.get("/api/dogs/?ordering=rating")
    assert res.status_code == 200
    ratings = [x["rating"] for x in res.data["results"]]
    assert ratings == sorted(ratings)

    # ordering by rating descending
    res2 = api_client.get("/api/dogs/?ordering=-rating")
    assert res2.status_code == 200
    ratings2 = [x["rating"] for x in res2.data["results"]]
    assert ratings2 == sorted(ratings2, reverse=True)


def test_patch_update_rating(api_client, seeded_dogs):
    dog = Dog.objects.first()
    res = api_client.patch(
        f"/api/dogs/{dog.id}/", {"rating": 4}, format="json")
    assert res.status_code == 200
    dog.refresh_from_db()
    assert dog.rating == 4


def test_bulk_delete(api_client, seeded_dogs):
    ids = list(Dog.objects.values_list("id", flat=True))[:2]
    res = api_client.post("/api/dogs/bulk-delete/",
                          {"ids": ids}, format="json")
    assert res.status_code == 200
    assert res.data["deleted"] == 2
    assert Dog.objects.filter(id__in=ids).count() == 0
