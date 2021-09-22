from django.contrib import admin

from .models import Product, Calorie


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


admin.site.register(Product, ProductAdmin)
