import Vue from 'vue';
import Vuex from 'vuex';

import {
  getNotice, getQuestions, getDue, getSubmitted, getHash,
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
    hash: undefined,
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
      state.questionArray[index].answer = value;
    },
    injectCommitted(state, newQuestionArray) {
      state.questionArray = newQuestionArray;
    },
  },
  actions: {
    async update({ commit }, hash) {
      const [
        { data: noticeArray }, { data: due }, { data: questionArray },
      ] = await Promise.all([
        getNotice(), getDue(), getQuestions(),
      ]);
      commit('handleUpdate', {
        noticeArray, due, questionArray, hash,
      });
    },
    async init({ dispatch, state: { questionArray: tempQuestionArray }, commit }) {
      const { data: hash } = await getHash();
      await dispatch('update', hash);
      const { data: submitted } = await getSubmitted();

      const submittedMap = new Map(submitted.map(item => ([item.id, item.answer])));
      const submittedMapKeys = [...submittedMap.keys()];

      const newQuestionArray = tempQuestionArray.map(item => (
        { ...item, answer: submittedMapKeys.includes(item.id) ? submittedMap.get(item.id) : '' }
      ));

      commit('injectCommitted', newQuestionArray);
    },
  },
});
