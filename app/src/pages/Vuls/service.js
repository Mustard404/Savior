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
  console.log(params)
  return request('/api/vul/'+ params.id + '/', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: { vul_status: params.vul_status },
  });
}

/** 导出漏洞列表 GET /api/vul/ */
export async function vuldownload() {
  return request('/api/vul_download/', {
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
