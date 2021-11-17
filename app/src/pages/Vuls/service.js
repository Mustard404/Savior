// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment'

/** 获取漏洞列表 GET /api/vul/ */
export async function queryvul(params) {
  return request('/api/vul/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    params: { ...params },
  });
}
/** 更新漏洞状态 PUT /api/vul/ */

export async function updateRule(params) {
  return request('/api/vul/'+ params.id + '/', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: { vul_status: params.vul_status },
  });
}

/** 删除漏洞 DELETE /api/vul/ */

export async function deleteRule(params) {
  console.log(params.id)
  return request('/api/vul/'+ params.id + '/', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

/** 历史漏洞下载 POST /api/vul_download/ */
export async function vuldownload(params) {
  return request('/api/vul_download/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: params,
    responseType : 'blob',
  }).then((res) => {
    console.log(params)
    let url = URL.createObjectURL(new Blob([res]));
    let filename = params.report_center + '_' + params.report_systemname + '_No' + params.report_no + '.docx';
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

/** 导出漏洞列表 GET /api/vul/ */
export async function vulsdownload() {
  return request('/api/vuls_download/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    responseType : 'blob',
  }).then((res) => {
    let url = URL.createObjectURL(new Blob([res]));
    let filename = 'Savior_漏洞列表_' + moment().format('LL') + '.xls';
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}
