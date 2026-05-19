from rest_framework import serializers

from .models import Farmer, Listing, Supplier, WasteRequest


class SupplierSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Supplier
        fields = ("id", "name", "contact", "location", "owner", "created_at", "updated_at")
        read_only_fields = ("id", "owner", "created_at", "updated_at")


class FarmerSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Farmer
        fields = ("id", "name", "contact", "location", "owner", "created_at", "updated_at")
        read_only_fields = ("id", "owner", "created_at", "updated_at")


class ListingSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = Listing
        fields = (
            "id",
            "supplier",
            "supplier_name",
            "title",
            "description",
            "type",
            "quantity",
            "location",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "supplier_name")

    def validate_supplier(self, supplier):
        request = self.context.get("request")
        if request and supplier.owner != request.user:
            raise serializers.ValidationError("You can only create listings for your own supplier.")
        return supplier


class WasteRequestSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source="listing.title", read_only=True)
    farmer_name = serializers.CharField(source="farmer.name", read_only=True)

    class Meta:
        model = WasteRequest
        fields = (
            "id",
            "listing",
            "listing_title",
            "farmer",
            "farmer_name",
            "message",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "created_at", "updated_at", "listing_title", "farmer_name")

    def validate(self, attrs):
        request = self.context.get("request")
        farmer = attrs.get("farmer")
        if request and farmer and farmer.owner != request.user:
            raise serializers.ValidationError("You can only create requests for your own farmer profile.")
        return attrs
