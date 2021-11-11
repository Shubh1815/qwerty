from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import User, StudentUser, Student
from .tasks import notify_student_about_account_creation

# Register your models here.


class StudentInline(admin.StackedInline):
    model = Student
    exclude = ("qrcode",)
    verbose_name_plural = "Student Info"
    can_delete = False


class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ("email", "first_name", "last_name")
    list_filter = ("role",)
    search_fields = ("email",)
    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("role", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {"fields": ("email", "password1", "password2", "role")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
    )


class StudentAdmin(UserAdmin):
    inlines = [
        StudentInline,
    ]
    list_display = (
        "get_student_batch",
        "get_student_enrollment_no",
        "first_name",
        "last_name",
    )
    list_filter = ("student__batch",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("role",)}),
    )
    ordering = ("student__batch", "student__enrollment_no")

    def get_changeform_initial_data(self, request):
        initial_data = super().get_changeform_initial_data(request)
        initial_data["role"] = User.Roles.STUDENT
        return initial_data

    def get_form(self, request, obj, change, **kwargs):
        form = super().get_form(request, obj=obj, change=change, **kwargs)
        form.base_fields["role"].disabled = True
        return form

    def get_student_enrollment_no(self, obj):
        return obj.student.enrollment_no

    def get_student_batch(self, obj):
        return obj.student.batch

    def save_model(self, request, obj, form, change):
        obj = super().save_model(request, obj, form, change)

        student_email = form.cleaned_data.get("email")
        student_password = form.cleaned_data.get("password1")

        notify_student_about_account_creation.delay(student_email, student_password)

        return obj

    get_student_batch.short_description = "Batch"
    get_student_enrollment_no.short_description = "Enrollment No."


admin.site.register(User, UserAdmin)
admin.site.register(StudentUser, StudentAdmin)
