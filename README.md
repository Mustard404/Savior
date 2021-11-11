# 🍋 Savior —— 渗透测试报告辅助生成工具

Mustard404 ![](https://sec404.cn)

## 🎈 背景

在某项目中带的两个渗透测试工程师发现报告写的很不规范，标志性内容经常忽略忘记修改，而且在比较忙的时候，常常忘记进行漏洞统计。
因此研发了Savior-渗透测试报告辅助生成系统，起这个名字也是为了拯救大多数逗逼渗透测试工程师，告别繁琐的渗透测试报告编写过程及漏洞统计过程。  
一个菜狗🐶通宵一年写的菜鸡🐔项目。。。

## ⏰ 系统框架

- 前端：Ant Design Pro  
- 后端：Django REST Framework  
- 数据库：Mysql  

## 🍙 主要功能

- 项目管理：根据项目的不同可上传项目的专属渗透测报告模板，并可以根据需要进行模板自定义模板（/Demo/demo.docx）；
- 整改建议管理：此平台主要就是为了体现标准化输出，因此可通过内置漏洞描述及修复建议进行快速输出，并支持自定义修改（/Demo/常规WEB渗透测试漏洞描述及修复方法.docx）；
- 一键生成：通过提交报告模块，内联项目模板，快速生成渗透测试报告，真正达到了一键生成，并确保报告内数据准确、字体统一、格式标准；
- 用户管理：主要是方便统计漏洞的发现者，后续可能大概也许会添加漏洞统计模块，根据提交数据、漏洞类型、时间等进行统计报表，当前用户管理模块仅允许通过Django后台进行修改，前端只负责展示，主要是我太懒了。。。
- 自动邮件：在生成报告后可通过用户管理配置的自动邮件发送功能进行邮件通知，可自定义邮件模板，这样再报告给客户的时候就可以直接转发了（暖男功能）；
- 漏洞统计：每次渗透过后，需要挨个查找报告进行统计整理，现在只要提交报告后，后台会自动联动；
- 漏洞报表一键导出
- 漏洞跟踪：增加了漏洞状态字段，创建报告后，漏洞状态默认为新增，漏洞管理模块可进行复测，包括已整改、未整改两种状态；

## 🚗 相关预览

[Demo](http://savior.sec404.cn) 
演示账号：admin 
演示密码：Savior@404  

## ✨ 安装指南

首先将代码clone到本地： 
git clone https://github.com/Mustard404/Savior.git  

### Docker部署

我们推荐使用Docker进行部署，相对于源码部署更为简单和快速。  

部署前请务必先安装Docker及docker-compose。  

修改配置文件  
首先复制根目录的.env.docker并重命名为.env，修改其中的Email Settings和initial Administrator配置。这两个配置分别控制邮件提醒，以及初始管理帐号密码及邮箱。（务必把邮箱修改为自己邮箱，不然可能会出现非预期错误！）  

一键启动  
docker-compose up -d  
访问[http://127.0.0.1:8000](http://127.0.0.1:8000) 即可看到页面。  

修改启动端口  
如果想修改启动端口，可以修改docker-compose.yaml文件中web容器的ports。 

默认为8000:8000，比如要修改为8080端口可改为8080:8000。  

### 手动部署

简单开发环境  
前端环境  
cd app  
yarn && yarn start  
后端环境  
python3 manage.py runserver 0.0.0.0   

## 📦 使用手册

### 初始化说明

考虑到安全性，目前用户管理、项目管理托管于Django管理后台。  
访问[http://127.0.0.1:8000](http://127.0.0.1:8000) 即可看到页面（默认账号密码为admin/Savior@404）。

#### 用户管理

请完善API>用户的Name、Avatar、Autosentmail三个字段，分别控制报告的作者、头像（图片Url）、生成报告后自动发送渗透测试报告到邮箱。 
![](preview/Userinfo.jpg) 

#### 项目管理

请通过API>Projects进行添加项目，可根据不通项目选择不通的渗透测试报告模板。参数说明：Project logo（项目Logo）、Project center（项目名称）、Project description（项目描述）、Project template（渗透测试报告模板，目前标准模板可使用Demo/demo.docx，后面会介绍自定义模板） 
![](preview/Projects.jpg) 

#### 整改设置

访问[http://127.0.0.1:8000](http://127.0.0.1:8000) 可进入Savior平台，通过个人设置>整改设置>添加漏洞模板可进行设置漏洞类型、漏洞描述、修复建议从而达到标准化。目前整理了一些通用的修复建议模板，请参考Demo/常规WEB渗透测试漏洞描述及修复方法.docx。  
![](preview/program.jpg)  

#### 模板参数说明

目前通用的漏洞模板请参考Demo/demo.docx。  
其中word中参数说明如下，也可通过自行创建word替换参数变量自定义渗透测试报告模板  
- {{report_no}}-漏洞编号，通过时间戳自动生成，确保漏洞编号的唯一性  
- {{report_center}}-测试项目，为项目管理中项目名称  
- {{report_systemname}}-系统名称  
- {{report_start_time}}-测试开始时间    
- {{report_end_time}}-测试结束时间    
- {{report_author}}-测试提交人，对应用户管理的Name参数    
- {{report_test_url}}-测试Url 
- {% for vuls in vuls %}{% if loop.last %}{{loop.length}}{% endif %}{% endfor %}-漏洞个数 
- 以下漏洞详情请利用{%tr for vuls in vuls %}{%tr endfor %}进行循环遍历。如想列出所有漏洞URL,则使用参数{%tr for vuls in vuls %}{{item.vul_url}}{%tr endfor %}  
- {{item.vul_url}}-漏洞Url  
- {{item.vul_recurrence}}-漏洞复现  
- {{item.vul_level}}-漏洞危险等级 
- {{item.vul_describe}}-漏洞描述  
- {{item.vul_modify_repair}}-修复建议 

### 创建报告

登入Savior后，选择创建报告功能。  
首先完善报告的基本信息。  
![](preview/report1.jpg)  
选择漏洞管理的添加漏洞功能。选择漏洞类型后，漏洞名称、漏洞描述、修复建议会根据整改设置进行自动联动，并可根据需求进行自定义修改。  
![](preview/report2.jpg)  
注：未提交前请勿刷新也没，此时漏洞详情保存为前端。提交后会自动生成渗透测试报告并进行下载。  
![](preview/report3.jpg)  
打开报告会提示更新域，更新请选择是，再选择更新整个目录，此问题主要是为了更新目录，不然渗透测试报告中目录无法自动更新。  
![](preview/report4.jpg)  
如果在用户管理打开了Autosentmail功能，渗透测试报告会自动发送至我们邮箱，方便转给甲方爸爸。  
![](preview/mail.jpg) 

### 漏洞列表

访问Savior平台，选择漏洞列表可进行漏洞统计并进行漏洞复测。其中漏洞包含三个状态（新发现、已修复、未修复）  
![](preview/vuls.jpg) 
通过选择导出数据功能，可将漏洞列表导出为Excle。 
![](preview/vulsdownload.jpg) 

## 致谢

感谢 [echo503](https://github.com/echo503) 提供的项目帮助   
感谢 [lp0int](https://github.com/lp0int) 提供的项目帮助   
项目框架及Docker部署参考[Github-Monitor](https://github.com/VKSRC/Github-Monitor) 

## 后续升级计划

- 用户管理、项目管理迁移至前端；  
- 大数据看板; 

## 其它说明

此项目为开源项目，如果想进行商业利用，请进行留言联系。  
如果有使用问题，请添加Q群：279876555  

## 打赏

如果该项目对你有所帮助，可以通过以下方式对作者进行打赏。  
![](preview/wppay.png)  
