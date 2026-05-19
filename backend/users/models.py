from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    ROLE_URBAN = "urban"
    ROLE_RURAL = "rural"
    ROLE_CHOICES = (
        (ROLE_URBAN, "Urban Provider"),
        (ROLE_RURAL, "Rural Farmer"),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
