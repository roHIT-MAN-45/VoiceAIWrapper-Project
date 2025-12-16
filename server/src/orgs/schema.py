import graphene
from graphene_django import DjangoObjectType
from orgs.models import Organization


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "slug",
            "contact_email",
            "created_at",
        )
