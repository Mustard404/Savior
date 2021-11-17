# -*- coding: utf-8 -*-
from docxtpl import DocxTemplate, InlineImage
import jinja2
import datetime
from docx import Document
import lxml
from docx.shared import Mm, Inches, Pt
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
import os
from email.header import make_header
from dotenv import load_dotenv
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=os.path.join(BASE_DIR, '.', '.env'), override=True)

#更新目录
def set_updatefields_true(docx_path):
    namespace = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    doc = Document(docx_path)
    # add child to doc.settings element
    element_updatefields = lxml.etree.SubElement(
        doc.settings.element, namespace+"updateFields"
    )
    element_updatefields.set(namespace+"val", "true")
    doc.save(docx_path)

#时间格式化
def datetimeformat(value):
    utc_date = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
    local_date = utc_date + datetime.timedelta(hours=8)
    local_date_str = datetime.datetime.strftime(local_date ,'%Y-%m-%d')
    return local_date_str


#漏洞统计
def vul_statistics(value,x):
    num=0
    print(x)
    for i in value:
        if(i['vul_level']==str(x)):
            num=num+1
    return num

def auto_report(data, project_template) :
    tpl = DocxTemplate(project_template)
    context = data
    jinja_env = jinja2.Environment()
    jinja_env.filters['datetimeformat'] = datetimeformat
    jinja_env.filters['vul_statistics'] = vul_statistics
    tpl.render(context, jinja_env,  autoescape=True)
    #替换漏洞详情
    vuls = {}
    for i in range(0, len(data["vuls"])):
        vulid = data["vuls"][i]["vul_recurrence"].replace('{','').replace('}','')
        sub_doc = tpl.new_subdoc('output/vuls/' + vulid + '.docx')
        vuls[vulid] = sub_doc
    tpl.render(vuls)
    #替换图片
    images = {}
    for i in range(0, len(data["vuls"])):
        imageno = data['vuls'][i]['image']
        for k in range(0, imageno):
            imageid = data["vuls"][i]["vul_recurrence"].replace('{','').replace('}','') + '_img_' + str(k)
            img = Image.open('./output/image/'+ imageid +'.png')
            if img.width>674:
                a = InlineImage(tpl, './output/image/'+ imageid +'.png', width=Mm(140))
            else:
                a = InlineImage(tpl, './output/image/'+ imageid +'.png', )
            images[imageid] = a
    tpl.render(images)
    reportname = 'output/report/'+ data['report_center'] + '_' + data['report_systemname'] + '_No' + str(data['report_no']) +'.docx'
    tpl.save(reportname)
    set_updatefields_true(reportname)
    #判断是否发送邮件到邮箱
    if data['autosentmail']:
        subject = data['report_center'] + '_' + data['report_systemname'] +'渗透测试报告'
        text_content = data['report_center'] + '_' + data['report_systemname'] +'渗透测试报告已通过系统生成完毕，请查看附件！' 
        #text_content = os.environ.get('EMAIL_CONTENT')
        from_email = settings.EMAIL_HOST_USER
        receive_email_addr = [data['email']]
        msg = EmailMultiAlternatives(subject, text_content, from_email, receive_email_addr)
        file_path = os.path.join(settings.BASE_DIR, reportname)
        text = open(file_path, 'rb').read()
        file_name = os.path.basename(file_path)
        b = make_header([(file_name, 'utf-8')]).encode('utf-8')
        msg.attach(b, text)
        msg.send()

