from django.contrib import admin
from django.core.checks import messages
from django.core.exceptions import ValidationError
from django.http.response import HttpResponseRedirect

from .models import Product, Calorie, Transaction, Item


class CalorieAdmin(admin.StackedInline):
    model = Calorie
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    class Media:
        css = {"all": ("css/calorie_inline.css",)}
        js = ("js/calorie_inline.js",)

    list_filter = ("category",)
    search_fields = ("name",)

    def get_inline_instances(self, request, obj):
        inlines = []

        if not obj or obj.category == Product.Categories.CANTEEN:
            inlines.append(CalorieAdmin)

        inline_instances = []
        for inline_class in inlines:
            inline = inline_class(self.model, self.admin_site)
            if request:
                if not (
                    inline.has_add_permission(request, obj)
                    or inline.has_change_permission(request, obj)
                    or inline.has_delete_permission(request, obj)
                ):
                    continue
                if not inline.has_add_permission(request, obj):
                    inline.max_num = 0
            inline_instances.append(inline)
        return inline_instances

    def get_readonly_fields(self, request, obj):
        readonly_fields = []

        if obj:
            readonly_fields.append("category")

        return readonly_fields


class ItemInline(admin.StackedInline):
    model = Item
    fields = ("product", "quantity")
    readonly_fields = ("price_per_quantity",)
    raw_id_fields = ("product",)
    extra = 1

    def get_fields(self, request, obj):
        fields = list(super().get_fields(request, obj=obj))
        if obj:
            fields.append("price_per_quantity")
        return fields


class TransactionAdmin(admin.ModelAdmin):
    fields = ("student",)
    readonly_fields = ("total_amount",)
    list_display = ("id", "date")
    inlines = [
        ItemInline,
    ]
    raw_id_fields = ("student",)

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            response = super().changeform_view(
                request,
                object_id=object_id,
                form_url=form_url,
                extra_context=extra_context,
            )
        except ValidationError as e:
            self.message_user(request, e.message, level=messages.ERROR)
            response = HttpResponseRedirect(request.path)
        finally:
            return response

    def get_fields(self, request, obj):
        fields = list(super().get_fields(request, obj=obj))
        if obj:
            fields.append("total_amount")
        return fields


admin.site.register(Product, ProductAdmin)
admin.site.register(Transaction, TransactionAdmin)
