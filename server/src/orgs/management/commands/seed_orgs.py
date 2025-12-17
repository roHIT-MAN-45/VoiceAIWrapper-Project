from django.core.management.base import BaseCommand
from orgs.models import Organization

class Command(BaseCommand):
    help = "seed initial organizations"

    def handle(self, *args, **options):
        orgs = [
            {
                "name": "Acme Corporation",
                "slug": "acme",
                "contact_email": "contact@acme.com",
            },
            {
                "name": "Globex Inc",
                "slug": "globex",
                "contact_email": "hello@globex.com",
            },
            {
                "name": "Initech",
                "slug": "initech",
                "contact_email": "support@initech.com",
            },
        ]

        for org in orgs:
            Organization.objects.get_or_create(
                slug=org["slug"],
                defaults=org,
            )
