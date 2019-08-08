import axios from 'axios';

const baseURL = 'https://wyzwb.com/'; // 开发环境地址


const instance = axios.create({
  baseURL,
  withCredentials: true,
});

const postData = (obj) => {
  const data = new FormData();
  Object.keys(obj).forEach((key) => {
    data.append(key, obj[key]);
  });
  return data;
};

export const login = (username, password) => instance.post('/login', postData({ username, password }));

export const getNotice = () => instance.get('/notice');
