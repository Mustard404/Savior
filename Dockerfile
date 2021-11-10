FROM ubuntu:20.04
MAINTAINER Mustard404<mustard404@sec404.cn>

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai
# install system requirement
#RUN sed -i s/archive.ubuntu.com/mirrors.aliyun.com/g /etc/apt/sources.list
#RUN sed -i s/security.ubuntu.com/mirrors.aliyun.com/g /etc/apt/sources.list
RUN sed -i s/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g /etc/apt/sources.list \
    && sed -i s/security.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y python3 python3-dev python3-pip nginx libmysqlclient-dev pandoc supervisor 

RUN sed -i 's/\/etc\/supervisor\/conf.d\/\*.conf/\/Savior\/docker\/supervisor-app.conf/g' /etc/supervisor/supervisord.conf
# install requirement
COPY . /Savior
COPY docker/savior.conf /etc/nginx/sites-enabled
RUN pip3 install -r /Savior/requirements.txt -i http://pypi.doubanio.com/simple --trusted-host pypi.doubanio.com

WORKDIR /Savior/

ENV LANG C.UTF-8

EXPOSE 8000

CMD ["/bin/bash", "/Savior/docker/run.sh"]