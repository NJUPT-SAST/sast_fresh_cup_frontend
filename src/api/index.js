import axios from 'axios';

const baseURL = 'https://wyzwb.com/api'; // 开发环境地址


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

export const getHash = () => instance.get('/hash');

export const login = (username, password) => instance.post('/login', postData({ username, password }));

export const getNotice = () => instance.get('/notice');

export const getDue = () => instance.get('/due');

export const getQuestions = () => instance.get('/questions');

export const getSubmitted = () => instance.get('/submited');

export const submit = (id, content) => instance.post('/submit', postData({ id, content }));

export const handIn = () => instance.post('/handIn', postData({ handIn: true }));

export const modifyNotice = (title, content, id) => instance.post('/admin/modifyNotice', postData((id === undefined ? { title, content } : { id, title, content })));

export const modifyDue = newDue => instance.post('/admin/modifyDue', postData({ newDue }));

export const modifyQuestions = (title, content, image, attachment, id) => instance.post('/admin/modifyQuestions', postData(id === undefined ? {
  title, content, image, attachment,
} : {
  title, content, image, attachment, id,
}));

export const modifyQuestionsMassively = questionsArray => instance.post('/admin/modifyQuestionsMassively', postData({ questionsArray }));
