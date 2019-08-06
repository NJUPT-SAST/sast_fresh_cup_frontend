import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    noticeCount: 0, // 这边的逻辑可能还要改，因为要显示未读的公告,
    isCover: false,
  },
  mutations: {
    handleNoticeCount(state, count) {
      state.noticeCount = count;
    },
    handleIsCover(state, value = false) {
      state.isCover = value;
    },
  },
});
