import axios from 'axios';

const { port, hostname } = window.location;

export const baseURL = process.env.VUE_APP_API_REQUEST_URL || `http://${hostname}${port ? `:${port}` : ''}`; // 开发环境地址
const clientSecret = process.env.VUE_APP_API_SECRET || 'lDCcVZDe8aPgBKK2Z3FfUXUMDHLXBj49GVB4ArkA'; // 密钥

let instance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('fresh_cup_token')}`,
  },
});

// 登录，获取token
export const login = (username, password) => axios
  .post(`${baseURL}/oauth/token`, {
    client_secret: clientSecret,
    username,
    password,
    grant_type: 'password',
    client_id: 2,
  })
  .then((response) => {
    const { access_token: token } = response.data;
    localStorage.setItem('fresh_cup_token', token);
    instance = axios.create({
      baseURL: `${baseURL}/api`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ret: 200, data: { ...response.data } };
  })
  .catch(() => ({ ret: 400, data: {} }));

// 获取比赛起止时间，比赛名称，比赛题目的MD5，公告的MD5
export const getHash = () => instance.get('/status').then(res => res.data);

// 获取登录者信息
export const userinfo = () => instance.get('/user').then(res => res.data);

// 获取公告
export const getNotice = () => instance.get('/notice').then(res => res.data);

// 用于获取所有题目
export const getQuestions = () => instance.get('/questions').then(res => res.data);

// 用于获取已提交的答案
export const getSubmitted = () => instance.get('/submitted').then(res => res.data);

// 用于提交某一道题目的答案
export const submit = (id, content) => instance.post('/submit', { problem_id: id, content }).then(res => res.data);

// 用于编辑或添加公告
export const modifyNotice = (title, content, id) => instance
  .post('/admin/modifyNotice', id === undefined ? { title, content } : { id, title, content })
  .then(res => res.data);

// 用于删除公告
export const deleteNotice = id => instance.post('/admin/modifyNotice', { id }).then(res => res.data);

// 修改比赛的起止时间，需要传入一个包含 start 和 end 的对象
export const modifyDue = newDue => instance.post('/admin/modifyDue', { ...newDue }).then(res => res.data);

// 用于添加或编辑题目
export const modifyQuestions = (title, content, options, id) => instance
  .post(
    '/admin/modifyQuestions',
    id === undefined
      ? {
        title,
        content,
        options,
      }
      : {
        title,
        content,
        options,
        id,
      },
  )
  .then(res => res.data);

// 用于删除题目
export const deleteQuestions = id => instance.post('/admin/modifyQuestions', { id }).then(res => res.data);

// 用于批量添加题目
export const modifyQuestionsMassively = questions => instance.post('/admin/modifyQuestionsMassively', { questions }).then(res => res.data);

// 用于添加资源;
export const addSource = file => instance
  .post('/admin/addSource', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(res => res.data);

// 用于删除资源
export const deleteSource = url => instance.post('/admin/deleteSource', { url }).then(res => res.data);
