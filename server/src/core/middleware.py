from orgs.models import Organization


class OrganizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        slug = request.headers.get("X-ORG-SLUG")

        if slug:
            try:
                request.organization = Organization.objects.get(slug=slug)
            except Organization.DoesNotExist:
                request.organization = None
        else:
            request.organization = None

        return self.get_response(request)
