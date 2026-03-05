from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from config.pagination import DefaultPagination
from .models import Breed, Description, Dog
from .serializers import BreedSerializer, DescriptionSerializer, DogSerializer


class BreedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Breed.objects.all().order_by("name")
    serializer_class = BreedSerializer


class DescriptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Description.objects.all().order_by("text")
    serializer_class = DescriptionSerializer


class DogViewSet(viewsets.ModelViewSet):
    queryset = Dog.objects.select_related(
        "breed", "description").all().order_by("-id")
    serializer_class = DogSerializer
    pagination_class = DefaultPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["breed__name", "description__text"]
    ordering_fields = ["id", "status", "rating",
                       "breed__name", "description__text", "updated_at"]

    @action(detail=False, methods=["post"], url_path="bulk-delete")
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        if not isinstance(ids, list) or not ids:
            return Response(
                {"detail": "ids must be a non-empty list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count, _ = Dog.objects.filter(id__in=ids).delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)
