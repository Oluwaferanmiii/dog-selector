from rest_framework.routers import DefaultRouter
from .views import DogViewSet, BreedViewSet, DescriptionViewSet

router = DefaultRouter()
router.register(r"dogs", DogViewSet, basename="dog")
router.register(r"breeds", BreedViewSet, basename="breed")
router.register(r"descriptions", DescriptionViewSet, basename="description")

urlpatterns = router.urls
