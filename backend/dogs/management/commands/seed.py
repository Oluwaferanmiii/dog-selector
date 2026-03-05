import random
from django.core.management.base import BaseCommand
from dogs.models import Breed, Description, Dog


class Command(BaseCommand):
    help = "Seed database with breeds, descriptions, and dogs."

    def handle(self, *args, **options):

        breeds = [
            "Labrador Retriever",
            "German Shepherd",
            "Golden Retriever",
            "French Bulldog",
            "Bulldog",
            "Poodle",
            "Beagle",
            "Rottweiler",
            "Dachshund",
            "Boxer",
            "Husky",
            "Shiba Inu",
            "Corgi",
            "Pitbull",
            "Irish Setter",
            "Saluki",
            "English Setter",
            "Gordon Setter",
            "Border Collie",
            "Doberman",
        ]

        descriptions = [
            "Friendly and energetic",
            "Calm and well-trained",
            "Great with kids",
            "Loves long walks",
            "Very playful",
            "Good apartment dog",
            "Needs experienced owner",
            "Shy but affectionate",
            "Highly intelligent",
            "Good with other pets",
            "Very loyal companion",
            "Fast and athletic",
            "Protective and alert",
            "Fluffy and cuddly",
            "Independent personality",
        ]

        notes = [
            "",
            "",
            "",
            "",
            "Special note example",
            "Adoption approved",
            "Needs extra training",
            "Good with families",
            "Medical check required",
            "Temporary foster placement",
        ]

        breed_objs = []
        for name in breeds:
            obj, _ = Breed.objects.get_or_create(name=name)
            breed_objs.append(obj)

        desc_objs = []
        for text in descriptions:
            obj, _ = Description.objects.get_or_create(text=text)
            desc_objs.append(obj)

        statuses = [
            Dog.Status.PENDING,
            Dog.Status.ACCEPTED,
            Dog.Status.REJECTED,
        ]

        created = 0

        for _ in range(80):
            Dog.objects.create(
                breed=random.choice(breed_objs),
                description=random.choice(desc_objs),
                status=random.choice(statuses),
                rating=random.randint(0, 5),
                note=random.choice(notes),
            )
            created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Seed complete. Created {created} dogs.")
        )
