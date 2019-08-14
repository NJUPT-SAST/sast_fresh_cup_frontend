import axios from 'axios';

const baseURL = 'https://contestease.wyzwb.com'; // 开发环境地址
const clientSecret = 'lDCcVZDe8aPgBKK2Z3FfUXUMDHLXBj49GVB4ArkA';

let instance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('fresh_cup_token')}`,
  },
});


export const login = (username, password) => axios.post(`${baseURL}/oauth/token`, {
  client_secret: clientSecret, username, password, grant_type: 'password', client_id: 2,
}).then((response) => {
  const { access_token: token } = response.data;
  localStorage.setItem('fresh_cup_token', token);
  instance = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { ret: 200, data: { ...response.data } };
}).catch(() => ({ ret: 400, data: {} }));

export const getHash = () => instance.get('/status').then(res => res.data);

export const userinfo = () => instance.get('/user').then(res => res.data);

export const getNotice = () => instance.get('/notice').then(res => res.data);

export const getQuestions = () => instance.get('/questions').then(res => res.data);

export const getSubmitted = () => instance.get('/submitted').then(res => res.data);

export const submit = (id, content) => instance.post('/submit', ({ problem_id: id, content })).then(res => res.data);

export const modifyNotice = (title, content, id) => instance.post('/admin/modifyNotice', ((id === undefined ? { title, content } : { id, title, content }))).then(res => res.data);

export const modifyDue = newDue => instance.post('/admin/modifyDue', ({ ...newDue })).then(res => res.data);

export const modifyQuestions = (title, content, options, id) => instance.post('/admin/modifyQuestions', (id === undefined ? {
  title, content, options,
} : {
  title, content, options, id,
})).then(res => res.data);

export const modifyQuestionsMassively = questions => instance.post('/admin/modifyQuestionsMassively', ({ questions })).then(res => res.data);

export const addSource = (problemId, type, name, source) => instance.post('/admin/addSource', {
  problem_id: problemId, type, name, source,
}).then(res => res.data);

export const deleteSource = url => instance.post('/admin/deleteSource', { url }).then(res => res.data);
