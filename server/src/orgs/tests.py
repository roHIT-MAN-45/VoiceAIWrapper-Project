import pytest
from django.test import TestCase
from orgs.models import Organization


class OrganizationModelTest(TestCase):
    """test organization model"""

    def setUp(self):
        """set up test data"""
        self.org = Organization.objects.create(
            name="Test Organization",
            slug="test-org",
            contact_email="test@example.com",
        )

    def test_organization_creation(self):
        """test organization can be created"""
        self.assertEqual(self.org.name, "Test Organization")
        self.assertEqual(self.org.slug, "test-org")
        self.assertEqual(self.org.contact_email, "test@example.com")

    def test_organization_str(self):
        """test organization string representation"""
        self.assertEqual(str(self.org), "test-org")

    def test_organization_ordering(self):
        """test organizations are ordered by name"""
        org2 = Organization.objects.create(
            name="Another Org",
            slug="another-org",
            contact_email="another@example.com",
        )
        orgs = list(Organization.objects.all())
        self.assertEqual(orgs[0].name, "Another Org")
        self.assertEqual(orgs[1].name, "Test Organization")

