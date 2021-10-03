import graphene

from qwerty.apps.core.schema import TransactionQuery, TransactionMutation


class Query(TransactionQuery, graphene.ObjectType):
    pass


class Mutation(TransactionMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
