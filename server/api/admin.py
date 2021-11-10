from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy

# Register your models here.
from api.models import Userinfo, Project, Program
class MyUserAdmin(UserAdmin):
    fieldsets = ()

admin.site.register(Userinfo, MyUserAdmin)

admin.site.register(Project)