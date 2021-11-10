import { request } from 'umi';
//查询项目
export async function queryProject(params) {
  return request('/api/project/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

//把params里的undefined改为‘’
const isUndefined = values => {
  for (let index in values) {
    if (typeof values[index] == 'undefined') values[index] = '';
  }
  return values;
};

//把params转为formData数据
function formatData(params) {
  const values = isUndefined(params);
  const formData = new FormData();
  for (const key in values) {
    formData.append(key, values[key]);
  }
  return formData;
}
//添加项目
export async function addProject(params) {
  const { ...restParams } = params;
  return request('/api/project/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
    data: formatData(params),
  });
}

export async function queryFakeList() {
  return request('/api/project/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}
export async function removeFakeList(params) {
  return request('/api/post_fake_list', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addFakeList(params) {
  return request('/api/post_fake_list', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateFakeList(params) {
  return request('/api/post_fake_list', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
