import {
  getNotice, getQuestions, getSubmitted, getHash,
} from '@/api/index';


const injectAnswer = (questionArray, submittedArray) => {
  const submittedMap = new Map(
    submittedArray.map(item => [item.problem_id, { content: item.content, option: item.option }]),
  );
  return questionArray.map((item) => {
    let answer = submittedMap.get(item.id);
    if (!answer) answer = { content: '', option: '' };
    return { ...item, answer };
  });
};

const INIT_STATE = {
  noticeArray: [],
  questionArray: [],
  due: {
    start: 0,
    end: 0,
  },
  readNoticeArray: [],
  hash: {
    problemsMd5: '',
    noticesMd5: '',
  },
  name: '',
  userinfo: {
    id: 0,
    username: '',
    email: '',
    isAdmin: 0,
  },
  submittedArray: [],
  loginStatus: false,
};


export default {
  async update({ commit, state }) {
    const requestList = [];
    const newState = {};
    const {
      data: {
        name, start, end, problems_md5: problemsMd5, notices_md5: noticesMd5,
      },
    } = await getHash();
    const {
      name: oldName, due: { start: oldStart, end: oldEnd },
      hash: { problemsMd5: oldProblemMd5, noticesMd5: oldNoticeMd5 },
    } = state;

    if (problemsMd5 === '' || problemsMd5 !== oldProblemMd5) requestList.push(getQuestions);
    if (noticesMd5 === '' || noticesMd5 !== oldNoticeMd5) requestList.push(getNotice);
    if (name !== oldName) newState.name = name;
    if (start !== oldStart || end !== oldEnd) newState.due = { start, end };
    newState.hash = { problemsMd5, noticesMd5 };

    const response = await Promise.all(requestList.map(item => item()));
    if (response.length) {
      requestList.forEach((item, index) => {
        if (item === getQuestions) {
          newState.questionArray = injectAnswer(response[index].data, state.submittedArray);
        }
        if (item === getNotice) newState.noticeArray = response[index].data;
      });
    }

    await commit('handleUpdate', newState);
  },
  async init({ dispatch, commit }) {
    await dispatch('update');
    const tempQuestionArray = this.state.questionArray;
    const { data: submitted } = await getSubmitted();
    const newQuestionArray = await injectAnswer(tempQuestionArray, submitted);
    await commit('injectCommitted', newQuestionArray);
    await commit('handleSubmittedInit', submitted);
  },
  async reset({ commit }) {
    await commit('handleResetState', INIT_STATE);
  },
};
