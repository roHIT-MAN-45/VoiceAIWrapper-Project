import graphene
from graphene_django import DjangoObjectType
from projects.models import Project


class ProjectType(DjangoObjectType):
    """graphql type for project"""
    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "status",
            "due_date",
            "created_at",
            "tasks",
        )


class ProjectStatsType(graphene.ObjectType):
    """graphql type for project statistics"""
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()


class Query(graphene.ObjectType):
    """project graphql queries"""
    projects = graphene.List(ProjectType)
    project_stats = graphene.Field(
        ProjectStatsType,
        project_id=graphene.ID(required=True),
    )

    def resolve_projects(self, info):
        """resolve all projects for the current organization"""
        org = info.context.organization
        if not org:
            raise Exception("X-ORG-SLUG header missing")

        return Project.objects.filter(organization=org)

    def resolve_project_stats(self, info, project_id):
        """resolve project statistics"""
        org = info.context.organization

        from tasks.models import Task

        qs = Task.objects.filter(
            project_id=project_id,
            project__organization=org,
        )

        total = qs.count()
        completed = qs.filter(status="DONE").count()

        return ProjectStatsType(
            total_tasks=total,
            completed_tasks=completed,
            completion_rate=(completed / total * 100) if total else 0,
        )
