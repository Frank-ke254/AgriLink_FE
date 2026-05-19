from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from market.models import Farmer, Listing, Supplier, WasteRequest
from users.models import UserProfile


class Command(BaseCommand):
    help = "Seed demo data for FarmCycle"

    def handle(self, *args, **options):
        urban_user, _ = User.objects.get_or_create(
            username="urban_demo",
            defaults={"email": "urban@example.com"},
        )
        urban_user.set_password("Password123!")
        urban_user.save()
        UserProfile.objects.get_or_create(user=urban_user, defaults={"role": UserProfile.ROLE_URBAN})

        rural_user, _ = User.objects.get_or_create(
            username="rural_demo",
            defaults={"email": "rural@example.com"},
        )
        rural_user.set_password("Password123!")
        rural_user.save()
        UserProfile.objects.get_or_create(user=rural_user, defaults={"role": UserProfile.ROLE_RURAL})

        sup_1, _ = Supplier.objects.get_or_create(
            name="City Market Foods",
            owner=urban_user,
            defaults={"contact": "0700-111-111", "location": "Nairobi"},
        )
        sup_2, _ = Supplier.objects.get_or_create(
            name="Green Grocer",
            owner=urban_user,
            defaults={"contact": "0700-222-222", "location": "Thika"},
        )

        farmer_1, _ = Farmer.objects.get_or_create(
            name="Mzee Kamau",
            owner=rural_user,
            defaults={"contact": "0712-333-333", "location": "Nyeri"},
        )
        Farmer.objects.get_or_create(
            name="Wanjiku Dairy",
            owner=rural_user,
            defaults={"contact": "0714-444-444", "location": "Nakuru"},
        )

        lst_1, _ = Listing.objects.get_or_create(
            supplier=sup_1,
            title="Banana peels",
            defaults={
                "description": "Fresh peels from juicing",
                "type": Listing.TYPE_FEED,
                "quantity": 50,
                "location": "Nairobi",
            },
        )
        Listing.objects.get_or_create(
            supplier=sup_2,
            title="Vegetable scraps",
            defaults={
                "description": "Assorted greens",
                "type": Listing.TYPE_FERTILIZER,
                "quantity": 30,
                "location": "Thika",
            },
        )
        Listing.objects.get_or_create(
            supplier=sup_2,
            title="Fruit pulp",
            defaults={
                "description": "Mixed fruit pulp from smoothies",
                "type": Listing.TYPE_FEED,
                "quantity": 80,
                "location": "Thika",
            },
        )

        WasteRequest.objects.get_or_create(
            listing=lst_1,
            farmer=farmer_1,
            defaults={"message": "Need this for composting this week."},
        )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
