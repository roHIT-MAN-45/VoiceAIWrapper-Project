import pytest
from django.test import TestCase
from orgs.models import Organization
from projects.models import Project


class ProjectModelTest(TestCase):
    """test project model"""

    def setUp(self):
        """set up test data"""
        self.org = Organization.objects.create(
            name="Test Organization",
            slug="test-org",
            contact_email="test@example.com",
        )
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            description="Test description",
            status="ACTIVE",
        )

    def test_project_creation(self):
        """test project can be created"""
        self.assertEqual(self.project.name, "Test Project")
        self.assertEqual(self.project.organization, self.org)
        self.assertEqual(self.project.status, "ACTIVE")

    def test_project_str(self):
        """test project string representation"""
        self.assertEqual(str(self.project), "Test Project (test-org)")

    def test_project_unique_together(self):
        """test project name is unique per organization"""
        # same name, same org should fail
        with self.assertRaises(Exception):
            Project.objects.create(
                organization=self.org,
                name="Test Project",
                status="ACTIVE",
            )

    def test_project_ordering(self):
        """test projects are ordered by created_at descending"""
        project2 = Project.objects.create(
            organization=self.org,
            name="Newer Project",
            status="ACTIVE",
        )
        projects = list(Project.objects.filter(organization=self.org))
        self.assertEqual(projects[0].name, "Newer Project")
        self.assertEqual(projects[1].name, "Test Project")

