from rest_framework import permissions, viewsets

from .models import Farmer, Listing, Supplier, WasteRequest
from .permissions import IsOwnerOrReadOnly
from .serializers import FarmerSerializer, ListingSerializer, SupplierSerializer, WasteRequestSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ("location",)
    search_fields = ("name", "contact", "location")
    ordering_fields = ("created_at", "name", "location")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ("location",)
    search_fields = ("name", "contact", "location")
    ordering_fields = ("created_at", "name", "location")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related("supplier", "supplier__owner").all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ("type", "location", "supplier")
    search_fields = ("title", "description", "location", "supplier__name")
    ordering_fields = ("created_at", "quantity", "title")


class WasteRequestViewSet(viewsets.ModelViewSet):
    queryset = WasteRequest.objects.select_related("listing", "listing__supplier", "farmer", "farmer__owner").all()
    serializer_class = WasteRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ("status", "listing", "farmer")
    search_fields = ("listing__title", "farmer__name", "message")
    ordering_fields = ("created_at", "status")

    def get_queryset(self):
        queryset = super().get_queryset()
        view = self.request.query_params.get("view")
        if view == "urban":
            return queryset.filter(listing__supplier__owner=self.request.user)
        if view == "rural":
            return queryset.filter(farmer__owner=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(status=WasteRequest.STATUS_PENDING)
