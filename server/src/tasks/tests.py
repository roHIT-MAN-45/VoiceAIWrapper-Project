import pytest
from django.test import TestCase
from orgs.models import Organization
from projects.models import Project
from tasks.models import Task, TaskComment


class TaskModelTest(TestCase):
    """test task model"""

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
            status="ACTIVE",
        )
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="Test description",
            status="TODO",
        )

    def test_task_creation(self):
        """test task can be created"""
        self.assertEqual(self.task.title, "Test Task")
        self.assertEqual(self.task.project, self.project)
        self.assertEqual(self.task.status, "TODO")

    def test_task_str(self):
        """test task string representation"""
        self.assertEqual(str(self.task), "Test Task")

    def test_task_ordering(self):
        """test tasks are ordered by created_at descending"""
        task2 = Task.objects.create(
            project=self.project,
            title="Newer Task",
            status="TODO",
        )
        tasks = list(Task.objects.filter(project=self.project))
        self.assertEqual(tasks[0].title, "Newer Task")
        self.assertEqual(tasks[1].title, "Test Task")


class TaskCommentModelTest(TestCase):
    """test task comment model"""

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
            status="ACTIVE",
        )
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task",
            status="TODO",
        )
        self.comment = TaskComment.objects.create(
            task=self.task,
            content="Test comment",
            author_email="author@example.com",
        )

    def test_comment_creation(self):
        """test comment can be created"""
        self.assertEqual(self.comment.content, "Test comment")
        self.assertEqual(self.comment.task, self.task)
        self.assertEqual(self.comment.author_email, "author@example.com")

    def test_comment_ordering(self):
        """test comments are ordered by created_at ascending"""
        comment2 = TaskComment.objects.create(
            task=self.task,
            content="Newer comment",
            author_email="author2@example.com",
        )
        comments = list(TaskComment.objects.filter(task=self.task))
        self.assertEqual(comments[0].content, "Test comment")
        self.assertEqual(comments[1].content, "Newer comment")

