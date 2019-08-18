export default {
  handleReadNotice(state) {
    state.readNoticeArray = state.noticeArray;
  },
  handleUpdate(state, newstate) {
    Object.keys(newstate).forEach((key) => {
      state[key] = newstate[key];
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
  handleSubmittedInit(state, newSubmitted) {
    state.submittedArray = newSubmitted;
  },
  handleResetState(state, initState) {
    Object.assign(state, initState);
  },
  handleLoginStatus(state, newStatus) {
    state.loginStatus = newStatus;
  },
};
