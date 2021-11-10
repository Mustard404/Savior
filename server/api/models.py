from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

#用户信息
class Userinfo(AbstractUser):
    
    name = models.CharField(max_length=100, blank=True, default='')
    avatar = models.CharField(max_length=100, blank=True, default='')
    autosentmail = models.BooleanField(default=False)

#项目列表
class Project(models.Model):
    project_logo = models.ImageField(upload_to='static/img/', blank=True, null=False)
    project_center = models.CharField(max_length=100, blank=True, default='', unique=True)   #所属项目,选择项目中心
    project_description = models.CharField(max_length=100, blank=True, default='')   #项目说明
    project_template = models.FileField(upload_to='output/project_template/', blank=False, null=False)

    class Meta:
        ordering = ['id']
    def __str__(self):
        return self.project_center
        
#整改方案 
class Program(models.Model):
    program_type = models.CharField(max_length=100, blank=True, default='')   #漏洞类型
    program_vul_name = models.CharField(max_length=100, blank=True, default='', unique=True)   #漏洞名称
    program_describe = models.CharField(max_length=1000, blank=True, default='')   #漏洞描述
    program_repair = models.CharField(max_length=1000, blank=True, default='')   #通用整改方案

    class Meta:
        ordering = ['id']
    def __str__(self):
        return self.id

#报告列表
class Report(models.Model):
    report_center = models.ForeignKey(Project, to_field='project_center', on_delete=models.CASCADE)   #所属项目,选择项目中心
    report_systemname = models.CharField(max_length=100, blank=True, default='')   #系统名称
    report_no = models.CharField(max_length=20, blank=True, default='', unique=True) #报告编号
    report_start_time  = models.DateField() #渗透开始时间
    report_end_time  = models.DateField() #渗透结束时间
    report_test_url = models.CharField(max_length=100, blank=True, default='')    #测试地址
    report_author = models.CharField(max_length=100, blank=True, default='') #报告作者

#漏洞列表
class Vul(models.Model):
    vul_no = models.ForeignKey(Report, related_name='vuls', on_delete=models.CASCADE)
    vul_type_name = models.CharField(max_length=100, blank=True, default='')   #漏洞类型，打算统计
    vul_name = models.CharField(max_length=100, blank=True, default='')   #漏洞名称，关联漏洞整改建议
    vul_url = models.CharField(max_length=100, blank=True, default='')  #漏洞地址
    sevullevel = (
        ('1','低危'),
        ('2','中危'),
        ('3','高危'),
     )
    vul_level = models.CharField(max_length=1, choices=sevullevel, blank=True)  #漏洞级别
    sevulstatus = (
        ('0','新发现'),
        ('1','未修复'),
        ('2','已修复'),
     )
    vul_status = models.CharField(max_length=1, choices=sevulstatus, default='0')  #漏洞状态
    vul_describe = models.CharField(max_length=1000, blank=True, default='')   #漏洞描述
    vul_recurrence = models.CharField(max_length=1000, blank=True, default='') #漏洞复现-富文本
    vul_modify_repair = models.CharField(max_length=500, blank=True, default='') #修复建议，根据漏洞实际情况
    
    class Meta:
        unique_together = ['vul_no', 'id']
        ordering = ['id']

    def __str__(self):
        return '%s: %s' % (self.vul_name, self.vul_url)

#图片上传
class Imgupload(models.Model):
    img_url = models.FileField(upload_to='static/img/')