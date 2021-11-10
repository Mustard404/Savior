import { request } from 'umi';

export async function addreport(params) {
  return request('/api/report/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: params,
    responseType : 'blob',
  }).then((res) => {
    let url = URL.createObjectURL(new Blob([res]));
    let filename = params.report_center + '_' + params.report_systemname + '_No' + params.report_no + '.docx';
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

//获取项目列表
export async function queryProject() {
  return request('/api/project/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

//获取修复建议
export async function queryProgram() {
  return request('/api/program/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

//获取修复建议联动
export async function queryProgramdata(params) {
  return request('/api/program/' + params + '/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}