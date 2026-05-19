from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from market.models import Farmer, Listing, Supplier, WasteRequest
from users.models import UserProfile


class MarketApiTests(APITestCase):
    def setUp(self):
        self.urban_user = User.objects.create_user(
            username="urban@example.com",
            email="urban@example.com",
            password="Password123!",
        )
        self.rural_user = User.objects.create_user(
            username="rural@example.com",
            email="rural@example.com",
            password="Password123!",
        )
        UserProfile.objects.create(user=self.urban_user, role=UserProfile.ROLE_URBAN)
        UserProfile.objects.create(user=self.rural_user, role=UserProfile.ROLE_RURAL)

        self.supplier = Supplier.objects.create(
            name="City Market Foods",
            contact="0700-111-111",
            location="Nairobi",
            owner=self.urban_user,
        )
        self.farmer = Farmer.objects.create(
            name="Mzee Kamau",
            contact="0712-333-333",
            location="Nyeri",
            owner=self.rural_user,
        )

    def authenticate(self, username, password):
        response = self.client.post(
            "/api/v1/auth/login/",
            {"username": username, "password": password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_public_can_list_listings(self):
        Listing.objects.create(
            supplier=self.supplier,
            title="Banana peels",
            description="fresh",
            type=Listing.TYPE_FEED,
            quantity=50,
            location="Nairobi",
        )
        response = self.client.get("/api/v1/listings/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data["count"], 1)

    def test_authenticated_urban_can_create_listing(self):
        self.authenticate("urban@example.com", "Password123!")
        response = self.client.post(
            "/api/v1/listings/",
            {
                "supplier": self.supplier.id,
                "title": "Vegetable scraps",
                "description": "assorted",
                "type": Listing.TYPE_FERTILIZER,
                "quantity": 20,
                "location": "Nairobi",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_rural_can_create_request(self):
        listing = Listing.objects.create(
            supplier=self.supplier,
            title="Fruit pulp",
            description="smoothie",
            type=Listing.TYPE_FEED,
            quantity=10,
            location="Thika",
        )
        self.authenticate("rural@example.com", "Password123!")
        response = self.client.post(
            "/api/v1/requests/",
            {"listing": listing.id, "farmer": self.farmer.id, "message": "Need for this weekend"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WasteRequest.objects.count(), 1)
