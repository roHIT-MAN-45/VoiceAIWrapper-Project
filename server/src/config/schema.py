import graphene

from projects.schema import Query as ProjectQuery
from tasks.schema import Query as TaskQuery

from projects.mutations import CreateProject, UpdateProject
from tasks.mutations import CreateTask, UpdateTask, AddTaskComment


class Query(ProjectQuery, TaskQuery, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()

    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_task_comment = AddTaskComment.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
