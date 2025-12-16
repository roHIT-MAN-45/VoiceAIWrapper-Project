import graphene
from tasks.models import Task, TaskComment
from projects.models import Project
from tasks.schema import TaskType, TaskCommentType


class CreateTask(graphene.Mutation):
    """mutation to create a new task"""
    task = graphene.Field(TaskType)

    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        status = graphene.String(required=True)
        description = graphene.String()
        assignee_email = graphene.String()

    def mutate(self, info, project_id, title, status, description="", assignee_email=""):
        """create task for a project"""
        org = info.context.organization

        project = Project.objects.get(
            id=project_id,
            organization=org,
        )

        task = Task.objects.create(
            project=project,
            title=title,
            status=status,
            description=description,
            assignee_email=assignee_email,
        )
        return CreateTask(task=task)


class UpdateTask(graphene.Mutation):
    """mutation to update an existing task"""
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()

    def mutate(self, info, task_id, **kwargs):
        """update task fields"""
        org = info.context.organization

        task = Task.objects.get(
            id=task_id,
            project__organization=org,
        )

        for key, value in kwargs.items():
            if value is not None:
                setattr(task, key, value)

        task.save()
        return UpdateTask(task=task)


class AddTaskComment(graphene.Mutation):
    """mutation to add a comment to a task"""
    comment = graphene.Field(TaskCommentType)

    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    def mutate(self, info, task_id, content, author_email):
        """create comment for a task"""
        org = info.context.organization

        task = Task.objects.get(
            id=task_id,
            project__organization=org,
        )

        comment = TaskComment.objects.create(
            task=task,
            content=content,
            author_email=author_email,
        )
        return AddTaskComment(comment=comment)
