import axios from 'axios';

let base = 'http://localhost:8099/luggage_storage/api';

export const requestLogin = params => { return axios.post(`${base}/login/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/admin`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/admin`, { params: params }); };

// export const removeUser = params => { return axios.post(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.post(`${base}/admin/delete`, { params: params }); };

export const saveUser = params => { return axios.post(`${base}/admin/save`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };