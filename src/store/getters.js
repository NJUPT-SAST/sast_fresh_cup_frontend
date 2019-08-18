export default {
  unreadNoticeCount(State) {
    const { noticeArray, readNoticeArray } = State;
    return noticeArray.length - readNoticeArray.length;
  },
};
