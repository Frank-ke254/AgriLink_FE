from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, "owner", None)
        if owner is not None:
            return owner == request.user
        supplier = getattr(obj, "supplier", None)
        return supplier is not None and supplier.owner == request.user
