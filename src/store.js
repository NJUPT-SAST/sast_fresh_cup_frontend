import Vue from 'vue';
import Vuex from 'vuex';

import {
  getNotice, getQuestions, getSubmitted, getHash,
} from './api/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    noticeArray: [],
    questionArray: [],
    due: {
      start: undefined,
      end: undefined,
    },
    readNoticeArray: [],
    hash: {
      problemsMd5: undefined,
      noticesMd5: undefined,
    },
    name: undefined,
    userinfo: {
      id: undefined,
      username: undefined,
      email: undefined,
      isAdmin: undefined,
    },
  },
  getters: {
    unreadNoticeCount(state) {
      const { noticeArray, readNoticeArray } = state;
      return noticeArray.length - readNoticeArray.length;
    },
  },
  mutations: {
    handleReadNotice(state) {
      state.readNoticeArray = state.noticeArray;
    },
    handleUpdate(state, newState) {
      Object.keys(newState).forEach((key) => {
        state[key] = newState[key];
      });
    },
    handleAnswerChange(state, { value, index }) {
      state.questionArray[index].answer.content = value;
    },
    injectCommitted(state, newQuestionArray) {
      state.questionArray = newQuestionArray;
    },
    handleUserinfo(state, data) {
      Object.keys(data).forEach((key) => {
        state.userinfo[key] = data[key];
      });
    },
  },
  actions: {
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
      if (problemsMd5 !== oldProblemMd5) requestList.push(getQuestions);
      if (noticesMd5 !== oldNoticeMd5) requestList.push(getNotice);
      if (name !== oldName) newState.name = name;
      if (start !== oldStart || end !== oldEnd) newState.due = { start, end };
      const response = await Promise.all(requestList.map(item => item()));
      if (response.length) {
        requestList.forEach((item, index) => {
          if (item === getQuestions) newState.questionArray = response[index].data;
          if (item === getNotice) newState.noticeArray = response[index].data;
        });
      }
      commit('handleUpdate', newState);
    },
    async init({ dispatch, state, commit }) {
      await dispatch('update');
      const tempQuestionArray = this.state.questionArray;
      const { data: submitted } = await getSubmitted();
      const submittedKeys = submitted.map(item => item.problem_id);
      const newQuestionArray = tempQuestionArray.map((item, index) => {
        if (submittedKeys.includes(item.id)) {
          const { option, content } = submitted[index];
          return { ...item, answer: { option, content } };
        }
        return { ...item, answer: { option: '', content: '' } };
      });
      commit('injectCommitted', newQuestionArray);
    },
  },
});
