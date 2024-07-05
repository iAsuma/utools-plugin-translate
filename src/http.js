// http.js
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000', // 你的API基地址
  timeout: 1000, // 请求超时时间
  // 其他配置...
});

// 请求拦截器
http.interceptors.request.use(config => {
  // 可以在这里添加例如token等请求头
  // config.headers['Authorization'] = 'Your Token';
  return config;
}, error => {
  // 请求错误处理
  return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(response => {
  // 对响应数据做处理，例如只返回data部分
  return response.data;
}, error => {
  // 响应错误处理
  return Promise.reject(error);
});

export default http;