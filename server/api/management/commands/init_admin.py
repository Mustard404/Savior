import os
import sys
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, os.path.join(BASE_DIR, 'server'))
from api.models import Userinfo

class Command(BaseCommand):
    def handle(self, *args, **options):
        username = os.environ.get('INIT_ADMIN_USERNAME')
        password = os.environ.get('INIT_ADMIN_PASSWORD')
        email = os.environ.get('INIT_ADMIN_EMAIL')
        print('Create administrator for {}'.format(username))
        Userinfo.objects.all().delete()
        Userinfo.objects.create_superuser(username=username, email=email, password=password)