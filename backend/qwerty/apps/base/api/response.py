import logging

from django.core.exceptions import (
    ObjectDoesNotExist,
    ValidationError as DjangoValidationError,
)
from django.http.response import Http404

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response


logger = logging.getLogger("django")


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
    def bad_request(message=None):
        data = {"status": "bad request"}
        if message:
            data["message"] = message

        return Response(status=status.HTTP_400_BAD_REQUEST, data=data)

    @staticmethod
    def unauthorized(message):
        data = {"status": "unauthorized"}
        if message:
            data["message"] = message

        return Response(status=status.HTTP_401_UNAUTHORIZED, data=data)

    @staticmethod
    def not_found(message):
        data = {
            "status": "not found",
            "message": message,
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
        logger.info(str(exception))

        try:
            response = None
            raise exception
        except DjangoValidationError:
            response = __class__.bad_request(exception.message)
        except ValidationError:
            response = __class__.bad_request(exception.get_full_details())
        except PermissionDenied:
            response = __class__.unauthorized(exception.get_full_details())
        except (ObjectDoesNotExist, NotFound, Http404):
            response = __class__.not_found(str(exception))
        except Exception:
            response = __class__.error(exception, request)
        finally:
            return response
