import axios from 'axios';

let base = 'http://localhost:8099/luggage_storage/api';

// 登录相关接口
export const requestLogin = params => { return axios.post(`${base}/login/login`, params).then(res => res.data); };

 // 管理员相关接口
export const getAdminListPage = params => { return axios.get(`${base}/admin`, { params: params }); };
export const removeAdmin = params => { return axios.post(`${base}/admin/delete`, params).then(res => res.data); };
export const batchRemoveAdmin = params => { return axios.post(`${base}/admin/delete`, params).then(res => res.data); };
export const saveAdmin = params => { return axios.post(`${base}/admin/save`, params).then(res => res.data); };
export const addAdmin = params => { return axios.post(`${base}/admin/save`, params).then(res => res.data); };

// 行李寄存相关接口
export const getStorageRecordListPage = params => { return axios.get(`${base}/storage`, { params: params }); };
export const addLuggageStorageRecord = params => { return axios.post(`${base}/storage/create`, params).then(res => res.data); };

// 行李取件相关接口
export const getPickupLuggageRecordListPage = params => { return axios.get(`${base}/pickup`, { params: params }); };
export const addCommonPickupRecord = params => { return axios.post(`${base}/pickup/common_pickup`, params).then(res => res.data); };
export const addmarkLuggageAsLostRecord = params => { return axios.post(`${base}/storage/mark_as_lost`, params).then(res => res.data); };
export const addOverduePickupRecord = params => { return axios.post(`${base}/storage/overdue_pickup`, params).then(res => res.data); };

// 行李类型相关接口
export const getLuggageTypeListPair = params => { return axios.get(`${base}/luggage_type/pair`, { params: params }); };
export const getLuggageTypes = params => { return axios.get(`${base}/luggage_type`, { params: params }); };

// 行李计费规则相关接口
export const getChargeCalculateRuleList = params => { return axios.get(`${base}/rule`, { params: params }); };

// 短信相关接口 
export const sendSmsWhenStorageFinished = params => { return axios.post(`${base}/sms/send_sms`, params).then(res => res.data); };

// 行李遗失赔偿登记记录相关接口
export const getLostCompensateRecordListPage = params => { return axios.get(`${base}/compensate`, { params: params }); };
export const addLostCompensateRecord = params => { return axios.post(`${base}/compensate/compensate_luggage`, params).then(res => res.data); };

// 行李遗失登记记录相关接口
export const getLostRegisterRecordListPage = params => { return axios.get(`${base}/register`, { params: params }); };

// 行李逾期未取清理相关接口
export const getOverdueRecordListPage = params => { return axios.get(`${base}/overdue`, { params: params }); };