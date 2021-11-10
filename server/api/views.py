import base64, os, pypandoc
from django.views.generic.base import View
from bs4 import BeautifulSoup
from rest_framework import status
from django.http import FileResponse
from urllib.parse import quote
from api.models import Project, Program, Report, Vul
from api.serializers import LoginSerializer, ProjectSerializer, ProgramSerializer, ReportSerializer, VulSerializer
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.auto_report_shell import auto_report
from django_filters import rest_framework as filters
from api.filter import VulFilter
import xlwt
from django.http import HttpResponse
import datetime



#登入接口
class LoginView(TokenObtainPairView):

    serializer_class = LoginSerializer

@api_view(['GET'])
def Userinfo_view(request):
    
    if request.method == 'GET':
        
        serializer = {}
        serializer['username'] = request.user.username
        serializer['name'] = request.user.name
        serializer['email'] = request.user.email
        serializer['avatar'] = request.user.avatar
        return Response(serializer)


@api_view(['GET', 'POST'])
def currentUser_view(request):
    
    if request.method == 'GET':
        serializer = {}
        serializer['username'] = request.user.username
        serializer['name'] = request.user.name
        serializer['email'] = request.user.email
        serializer['avatar'] = request.user.avatar
        serializer['autosentmail'] = request.user.autosentmail
        data={
            "data":serializer
        }
        return Response(data)

#项目列表
class ProjectViewSet(viewsets.ModelViewSet):

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

#整改方案
class ProgramViewSet(viewsets.ModelViewSet):

    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]

#报告列表

class ReportViewSet(viewsets.ModelViewSet):

    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        #同步漏洞详情到数据库
        data = self.request.data
        data['report_author'] = self.request.user.name
        data['autosentmail'] = self.request.user.autosentmail
        data['email'] = self.request.user.email
        #报告编号
        reportid = data['report_center'] + '_' + data['report_systemname'] + '_No' + str(data['report_no']) 

        for i in range(0, len(data["vuls"])):
            vulno = reportid + '_vul_' + str(i)
            htmlbody = data['vuls'][i]['vul_recurrence']
            soup = BeautifulSoup(htmlbody, "html.parser")
            #将html中base64图片转存
            imageid = 0
            image = {}
            for img in soup.find_all('img'):
                image[imageid] = vulno + '_img_' + str(imageid)
                imagedata = img.get('src').split(',')[1]
                with open("./output/image/"+ image[imageid] +".png", "wb") as f:
                    f.write(base64.b64decode(imagedata))
                    f.close()
                    img['src'] = ""
                    img.string = "{{" + image[imageid] + "}}"
                imageid = imageid + 1
            data['vuls'][i]['image'] = imageid
            data['vuls'][i]['vul_recurrence'] = "{{" + vulno +"}}"
            output = pypandoc.convert_text(soup, 'docx', 'html', outputfile='./output/vuls/' + vulno + '.docx')
            
        #正向项目模板
        project_template= Project.objects.values_list("project_template", flat=True).get(project_center=data["report_center"])
        
        #执行自动生成报告
        auto_report(data, project_template)
        for i in range(0, len(request.data["vuls"])):
            request.data['vuls'][i]['vul_recurrence'] =  request.data['report_center'] + '_' + request.data['report_systemname'] + '_No' + str(request.data['report_no']) + "_vul_" + str(i) 
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            #生成下载报告
            file_path = 'output/report/'+ data['report_center'] + '_' +data['report_systemname'] + '_No' + str(data['report_no']) +'.docx'
            response = FileResponse(open(file_path, 'rb'))
            response['Content-Type'] = "application/octet-stream"
            response['Content-Disposition'] = 'attachment;filename=' + quote(os.path.basename(file_path))

            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#漏洞列表
class VulViewSet(viewsets.ModelViewSet):

    queryset = Vul.objects.all()
    serializer_class = VulSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = VulFilter

#导出漏洞列表到excel
from django.http import HttpResponse
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
@api_view(['GET'])
@permission_classes((IsAuthenticated, ))

def vul_download(request):
    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="Savior_Vul_{0}.xls"'.format(
        datetime.datetime.now().strftime('%Y-%m-%d'))
    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('sheet1')
    row_num = 0
    datastyle = xlwt.XFStyle()
    datastyle.num_format_str = 'yyyy-mm-dd'
    font_style = xlwt.XFStyle()
    font_style.font.bold = True
    columns = ['序号', '所属项目', '系统', '报告编号', '发现人', '发现时间', '漏洞类型', '漏洞名称', '漏洞等级', '漏洞URL', '漏洞状态']
    for col_num in range(len(columns)):
        ws.write(row_num, col_num, columns[col_num], font_style)
    font_style = xlwt.XFStyle()
    for row in Vul.objects.all():
        row_num += 1
        report = Report.objects.values().get(id=row.vul_no.id)
        ws.write(row_num, 0, row_num)
        ws.write(row_num, 1, report['report_center_id'])
        ws.write(row_num, 2, report['report_systemname'])
        ws.write(row_num, 3, report['report_no'])
        ws.write(row_num, 4, report['report_author'])
        ws.write(row_num, 5, report['report_end_time'], datastyle)
        ws.write(row_num, 6, row.vul_type_name)
        ws.write(row_num, 7, row.vul_name)
        if int(row.vul_level) == 1:
            ws.write(row_num, 8, '低危')
        elif int(row.vul_level) == 2:
            ws.write(row_num, 8, '中危')
        elif int(row.vul_level) == 3:
            ws.write(row_num, 8, '高危')
        ws.write(row_num, 9, row.vul_url)
        if int(row.vul_status) == 0:
            ws.write(row_num, 10, '新发现')
        elif int(row.vul_status) == 1:
            ws.write(row_num, 10, '未修复')
        elif int(row.vul_status) == 2:
            ws.write(row_num, 10, '已修复')
    wb.save(response)

    return response