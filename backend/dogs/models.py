from django.db import models


class Breed(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self) -> str:
        return self.name


class Description(models.Model):
    text = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return self.text


class Dog(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    breed = models.ForeignKey(
        Breed, on_delete=models.PROTECT, related_name="dogs")
    description = models.ForeignKey(
        Description, on_delete=models.PROTECT, related_name="dogs"
    )
    rating = models.IntegerField(default=0)
    note = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.breed} - {self.description} ({self.status})"
