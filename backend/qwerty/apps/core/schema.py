import graphene

from django.db import transaction as db_transaction
from django.db.models import Sum
from graphene_django import DjangoListField
from graphene_django.types import DjangoObjectType

from qwerty.apps.accounts.models import StudentUser
from .models import Transaction, Product, Item


class ItemType(DjangoObjectType):
    class Meta:
        model = Item
        fields = ("product", "quantity")

    product = graphene.String()

    def resolve_product(self, info):
        return self.product.name


class TransactionType(DjangoObjectType):
    class Meta:
        model = Transaction
        fields = ("id", "student", "products", "total_amount", "date")

    products = graphene.List(ItemType)
    student = graphene.String()

    def resolve_products(self, info):
        return self.item_set.all()

    def resolve_student(self, info):
        return self.student.id


class TransactionQuery(graphene.ObjectType):

    transactions = DjangoListField(TransactionType)


class ItemInput(graphene.InputObjectType):
    product = graphene.String(required=True)
    quantity = graphene.Int(required=True)


class CreateTransaction(graphene.Mutation):
    class Arguments:
        student_id = graphene.String(required=True)
        products = graphene.List(ItemInput)

    transaction = graphene.Field(TransactionType)

    @staticmethod
    def mutate(root, info, student_id, products=[]):
        with db_transaction.atomic():
            transaction = Transaction.objects.create(student_id=student_id)
            for item in products:
                Item.objects.create(
                    transaction=transaction,
                    product_id=item.product,
                    quantity=item.quantity,
                )

        return CreateTransaction(transaction=transaction)


class TransactionMutation(graphene.ObjectType):
    create_transaction = CreateTransaction.Field()
