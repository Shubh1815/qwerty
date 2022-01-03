import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.db.models.manager import Manager

# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("User must have a email address")

        if not (first_name and last_name):
            raise ValueError("User must have a full name")

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )
        user.role = self.model.Roles.ADMIN
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    class Roles(models.TextChoices):
        ADMIN = "admin", "ADMIN"
        STAFF = "staff", "STAFF"
        STUDENT = "student", "STUDENT"
        MANAGER = "manager", "MANAGER"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=254, unique=True)
    first_name = models.CharField(max_length=127)
    last_name = models.CharField(max_length=127)

    role = models.CharField(max_length=15, choices=Roles.choices, default=Roles.STUDENT)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    @property
    def is_staff(self):
        return self.role in (self.Roles.ADMIN, self.Roles.STAFF)

    @property
    def is_student(self):
        return self.role == self.Roles.STUDENT

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class StudentManager(Manager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(role=User.Roles.STUDENT)
            .select_related("student")
        )


class StudentUser(User):

    objects = StudentManager()

    class Meta:
        proxy = True
        verbose_name = "Student"
        verbose_name_plural = "Students"
