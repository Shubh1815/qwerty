from django.core.exceptions import (
    ObjectDoesNotExist,
    ValidationError as DjangoValidationError,
)

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response


class BaseResponse:
    @staticmethod
    def paginated(message):
        data = {
            "status": "success",
            "count": message.data["count"],
            "previous": message.data["previous"],
            "next": message.data["next"],
            "data": message.data["results"],
        }

        return Response(status=status.HTTP_200_OK, data=data)

    @staticmethod
    def success(message=None):
        data = {
            "status": "success",
        }

        if message is not None:
            data["data"] = message

        return Response(status=status.HTTP_200_OK, data=data)

    @staticmethod
    def created(message=None):
        data = {"status": "success", "data": message}

        return Response(status=status.HTTP_201_CREATED, data=data)

    @staticmethod
    def bad_request(message=None, request=None):
        data = {"status": "bad request"}

        logs = {"message": message}
        if request:
            logs["headers"] = request.headers
            logs["data"] = request.data

        return Response(status=status.HTTP_400_BAD_REQUEST, data=data)

    @staticmethod
    def unauthorized(message, request=None):
        data = {
            "status": "unauthorized",
        }

        logs = {"message": message}
        if request:
            logs["headers"] = request.headers
            logs["data"] = request.data

        return Response(status=status.HTTP_401_UNAUTHORIZED, data=data)

    @staticmethod
    def not_found(message, request=None):
        data = {
            "status": "not found",
        }

        return Response(status=status.HTTP_404_NOT_FOUND, data=data)

    @staticmethod
    def error(e=None, request=None):
        data = {
            "status": "error",
            "message": "internal server error",
        }

        request_data = {}
        if request:
            request_data = {  # noqa: F841
                "headers": request.headers,
                "data": request.data,
            }

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=data)

    @staticmethod
    def exception_handler(exception, request=None):
        response = None
        try:
            raise exception
        except DjangoValidationError:
            response = __class__.bad_request(exception.message, request)
        except ValidationError:
            response = __class__.bad_request(exception.get_full_details(), request)
        except PermissionDenied:
            response = __class__.unauthorized(exception.get_full_details(), request)
        except ObjectDoesNotExist:
            response = __class__.not_found(str(exception), request)
        except Exception:
            response = __class__.error(exception, request)
        return response
