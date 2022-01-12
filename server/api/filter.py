from rest_framework import generics
from django_filters import rest_framework as filters
from api.models import Report, Vul
import django_filters



class VulFilter(filters.FilterSet):
    report_center = django_filters.CharFilter(field_name="vul_no__report_center__project_center", lookup_expr='icontains')
    report_systemname = django_filters.CharFilter(field_name="vul_no__report_systemname", lookup_expr='icontains')
    report_no = django_filters.CharFilter(field_name="vul_no__report_no", lookup_expr='icontains')
    report_author = django_filters.CharFilter(field_name="vul_no__report_author", lookup_expr='icontains')
    #vul_url = django_filters.CharFilter(field_name="vul_no__report_author", lookup_expr='icontains')

    class Meta:

        model = Vul
        fields = ['report_center', 'report_systemname', 'report_no', 'vul_url', 'report_author', 'vul_level', 'vul_status']
