import Vue from 'vue';
import Vuex from 'vuex';

import { getNotice, getQuestions, getDue } from './api/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    noticeArray: [],
    questionArray: [],
    due: Date.now(),
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
  },
  actions: {
    async update({ commit }, hash) {
      const { data: noticeArray } = await getNotice();
      const { data: due } = await getDue();
      const { data: questionArray } = await getQuestions();
      commit('handleUpdate', {
        noticeArray, due, questionArray, hash,
      });
    },
  },
});
