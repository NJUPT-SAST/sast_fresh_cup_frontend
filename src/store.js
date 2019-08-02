import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    noticeCount: 0, // 这边的逻辑可能还要改，因为要显示未读的公告
  },
  mutations: {
    handleNoticeCount(state, count) {
      state.noticeCount = count;
    },
  },
});
