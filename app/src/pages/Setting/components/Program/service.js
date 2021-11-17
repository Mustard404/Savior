import { request } from 'umi';

//查询漏洞整改方案
export async function queryProgram(params) {
  return request('/api/program/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    params,
  });
}
//添加漏洞整改方案
export async function addProgram(params) {
  const { ...restParams } = params;
  return request('/api/program/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: { ...restParams, method: 'post' },
  });
}

//删除漏洞整改方案
export async function removeProgram(params) {
  return request('/api/program/' + params.id + '/', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

//更新漏洞整改方案
export async function updateProgram(params) {
  const { ...restParams } = params;
  return request('/api/program/' + params.id + '/', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: { ...restParams, method: 'put' },
  }); 
}
