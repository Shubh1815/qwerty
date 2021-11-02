from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm Password", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "role")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1 != password2:
            ValidationError("Passwords don't match")

        validate_password(password1, self.instance)

        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data.get("password1"))

        if commit:
            user.save()

        return user


class CustomUserChangeForm(forms.ModelForm):

    password = ReadOnlyPasswordHashField(
        help_text="Raw passwords are not stored, so there is no way to see this user’s password"
    )

    class Meta:
        model = User
        fields = "__all__"
        exclude = ("is_superuser",)
