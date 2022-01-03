from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import ModelForm

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


class TransactionValidationForm(ModelForm):
    def clean(self):
        cleaned_data = super().clean()

        item_form_prefix = "items"
        total_item_forms = int(self.data.get(f"{item_form_prefix}-TOTAL_FORMS"))

        cleaned_data["total_amount"] = 0
        for item_form_id in range(total_item_forms):
            quantity = int(self.data.get(f"{item_form_prefix}-{item_form_id}-quantity"))
            product_name = self.data.get(f"{item_form_prefix}-{item_form_id}-product")
            price_per_quantity = Product.objects.values_list("amount", flat=True).get(
                name=product_name
            )

            cleaned_data["total_amount"] += price_per_quantity * quantity

        student = cleaned_data.get("student")
        if student.student.balance < cleaned_data["total_amount"]:
            raise ValidationError("Student doesn't have enough balance")

        return cleaned_data


class TransactionAdmin(admin.ModelAdmin):
    form = TransactionValidationForm

    fields = ("student",)
    readonly_fields = ("total_amount",)
    list_display = ("id", "date")
    inlines = [
        ItemInline,
    ]
    raw_id_fields = ("student",)

    def has_change_permission(self, request, obj=None):
        return False

    def get_fields(self, request, obj):
        fields = list(super().get_fields(request, obj=obj))
        if obj:
            fields.append("total_amount")
        return fields

    def save_model(self, request, obj, form, change):
        obj.total_amount = form.cleaned_data.get("total_amount")
        return super().save_model(request, obj, form, change)


admin.site.register(Product, ProductAdmin)
admin.site.register(Transaction, TransactionAdmin)
