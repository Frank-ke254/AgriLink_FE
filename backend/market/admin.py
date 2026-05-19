from django.contrib import admin

from .models import Farmer, Listing, Supplier, WasteRequest


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location", "owner", "created_at")
    search_fields = ("name", "contact", "location")


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location", "owner", "created_at")
    search_fields = ("name", "contact", "location")


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "type", "quantity", "location", "supplier", "created_at")
    list_filter = ("type", "location")
    search_fields = ("title", "description", "location")


@admin.register(WasteRequest)
class WasteRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "farmer", "status", "created_at")
    list_filter = ("status",)
