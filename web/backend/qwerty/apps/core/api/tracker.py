import decimal
from datetime import timedelta

from django.db.models import Sum, F
from django.utils import timezone
from rest_framework.views import APIView

from qwerty.apps.accounts.permissions import IsStudent
from qwerty.apps.base.api import BaseResponse
from qwerty.apps.core.models import Transaction


class CalorieTracker(APIView):

    permission_classes = [IsStudent]

    def get(self, request):
        try:
            try:
                days = int(request.query_params.get("days", 7))
            except TypeError:
                days = 7

            end_date = timezone.now()
            start_date = end_date - timedelta(days=days)

            queryset = (
                Transaction.objects.filter(
                    student=request.user, date__range=[start_date, end_date]
                )
                .values("date__date")
                .annotate(
                    calories=Sum(
                        F("items__product__calorie__calories") * F("items__quantity")
                    )
                )
                .values("calories", date=F("date__date"))
                .order_by("date")
            )
            response = BaseResponse.success(queryset)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response


class ExpenseTracker(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        try:
            try:
                days = int(request.query_params.get("days", 7))
            except TypeError:
                days = 7

            end_date = timezone.now()
            start_date = end_date - timedelta(days=days)

            queryset = (
                Transaction.objects.filter(
                    student=request.user, date__range=[start_date, end_date]
                )
                .values("date__date")
                .annotate(expenditure=Sum("total_amount"))
                .values("expenditure", date=F("date__date"))
                .order_by("date")
            )

            response = BaseResponse.success(queryset)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response
