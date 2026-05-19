from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import UserProfile


class UserAuthTests(APITestCase):
    def test_register_creates_profile_and_tokens(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {
                "username": "newuser@example.com",
                "email": "newuser@example.com",
                "password": "Password123!",
                "role": UserProfile.ROLE_URBAN,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertTrue(User.objects.filter(username="newuser@example.com").exists())
