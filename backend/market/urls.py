from rest_framework.routers import DefaultRouter

from .views import FarmerViewSet, ListingViewSet, SupplierViewSet, WasteRequestViewSet

router = DefaultRouter()
router.register("suppliers", SupplierViewSet, basename="supplier")
router.register("farmers", FarmerViewSet, basename="farmer")
router.register("listings", ListingViewSet, basename="listing")
router.register("requests", WasteRequestViewSet, basename="request")

urlpatterns = router.urls
