#from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from api.models import Userinfo, Project, Program, Report, Vul, Imgupload

#登入接口
class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        print(self.user)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data

#用户信息
class UserinfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Userinfo
        fields = ['username', 'name', 'email', 'avatar', 'groups', 'autosentmail']

#项目列表
class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    project_template_name = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['id', 'project_logo', 'project_center', 'project_description', 'project_template', 'project_template_name']
    
    #格式化模板输出
    def get_project_template_name(self, obj):
        path= Project.objects.values_list("project_template", flat=True).get(project_center=obj)
        value = path.replace("output/project_template/","")
        return value

#整改方案
class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = [ 'id', 'program_type', 'program_vul_name', 'program_describe', 'program_repair']

#漏洞列表
class VulSerializer(serializers.ModelSerializer):
    report_center = serializers.SerializerMethodField()
    report_systemname = serializers.SerializerMethodField()
    report_no = serializers.SerializerMethodField()
    report_end_time = serializers.SerializerMethodField()
    report_test_url = serializers.SerializerMethodField()
    report_author = serializers.SerializerMethodField()
    class Meta:
        model = Vul
        fields = ['id', 'report_center',  'report_systemname', 'report_no', 'vul_type_name', 'report_end_time',  'vul_name', 'report_test_url', 'vul_url', 'report_author','vul_level', 'vul_status', 'vul_describe', 'vul_recurrence', 'vul_modify_repair']
    
    #关联主键
    def get_report_center(self, obj):
        return Report.objects.values_list("report_center", flat=True).get(id=obj.vul_no.id)
    def get_report_systemname(self, obj):
        return Report.objects.values_list("report_systemname", flat=True).get(id=obj.vul_no.id)
    def get_report_no(self, obj):
        return Report.objects.values_list("report_no", flat=True).get(id=obj.vul_no.id)
    def get_report_end_time(self, obj):
        return Report.objects.values_list("report_end_time", flat=True).get(id=obj.vul_no.id)
    def get_report_test_url(self, obj):
        return Report.objects.values_list("report_test_url", flat=True).get(id=obj.vul_no.id)
    def get_report_author(self, obj):
        return Report.objects.values_list("report_author", flat=True).get(id=obj.vul_no.id)


#报告列表
class ReportSerializer(serializers.ModelSerializer):
    vuls = VulSerializer(many=True)

    class Meta:
        model = Report
        fields = ['id', 'report_center', 'report_systemname', 'report_no', 'report_start_time', 'report_end_time', 'report_test_url', 'report_author', 'vuls']

    def create(self, validated_data):
        
        vuls_data = validated_data.pop('vuls')
        vul_no = Report.objects.create(**validated_data)
        for vul_data in vuls_data:
            Vul.objects.create(vul_no=vul_no, **vul_data)
        return vul_no

#图片上传
class ImguploadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Imgupload
        fields = [ 'img_url']