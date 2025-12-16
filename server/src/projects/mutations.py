import graphene
from projects.models import Project
from projects.schema import ProjectType


class CreateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(required=True)
        due_date = graphene.Date()

    def mutate(self, info, name, status, description="", due_date=None):
        org = info.context.organization
        if not org:
            raise Exception("Organization required")

        project = Project.objects.create(
            organization=org,
            name=name,
            description=description,
            status=status,
            due_date=due_date,
        )
        return CreateProject(project=project)


class UpdateProject(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(lambda: ProjectType)

    def mutate(self, info, project_id, **kwargs):
        org = info.context.organization
        project = Project.objects.get(
            id=project_id,
            organization=org,
        )

        for key, value in kwargs.items():
            setattr(project, key, value)

        project.save()
        return UpdateProject(project=project)