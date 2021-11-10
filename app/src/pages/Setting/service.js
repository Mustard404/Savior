import { request } from 'umi';

export async function queryCurrent() {
  return request('/api/currentuser/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

export async function updatCurrent() {
  return request('/api/currentuser/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`
    },
  });
}

export async function query() {
  return request('/api/users');
}
