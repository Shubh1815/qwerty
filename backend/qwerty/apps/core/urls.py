from django.urls import path

from rest_framework.routers import DefaultRouter

from .api import ProductViewSet, TransactionViewSet, CalorieTracker, ExpenseTracker

router = DefaultRouter()
router.register("transaction", TransactionViewSet)
router.register("product", ProductViewSet)

urlpatterns = [
    path("tracker/calorie/", CalorieTracker.as_view(), name="calorie-tracker"),
    path("tracker/expense/", ExpenseTracker.as_view(), name="expense-tracker"),
]
