import graphene
from graphene_django import DjangoObjectType
from tasks.models import Task, TaskComment


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = (
            "id",
            "content",
            "author_email",
            "created_at",
        )


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "status",
            "assignee_email",
            "due_date",
            "created_at",
            "comments",
        )


class Query(graphene.ObjectType):
    tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(required=True),
    )

    task_comments = graphene.List(
        TaskCommentType,
        task_id=graphene.ID(required=True),
    )

    def resolve_tasks(self, info, project_id):
        org = info.context.organization
        return Task.objects.filter(
            project_id=project_id,
            project__organization=org,
        )

    def resolve_task_comments(self, info, task_id):
        org = info.context.organization
        return TaskComment.objects.filter(
            task_id=task_id,
            task__project__organization=org,
        ).order_by("created_at")
