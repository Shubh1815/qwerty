from rest_framework.exceptions import MethodNotAllowed
from rest_framework.viewsets import ModelViewSet


class BaseViewSet(ModelViewSet):
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT", detail="Method Not Allowed")

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH", detail="Method Not Allowed")

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE", detail="Method Not Allowed")
