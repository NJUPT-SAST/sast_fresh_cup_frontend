<template>
  <div
    class="answer-container"
    v-if="questionList.length && questionList[selectedIndex].answer !== undefined"
  >
    <div class="answer-sidebar-container elevation-3">
      <side-bar-item
        v-for="(item,index) in questionList"
        :key="index"
        :text="item.title.slice(0,10)+'...'"
        :answered="Boolean(item.answer.option.length+item.answer.content.length)"
        :selected="selectedIndex === index"
        @click="selectedIndex = index"
      />
    </div>
    <div class="answer-content">
      <fab-group
        :isUpDisabled="selectedIndex === 0"
        :isDownDisabled="selectedIndex === questionList.length-1"
        @handleUp="handleQuestionSwitch(true)"
        @handleDown="handleQuestionSwitch(false)"
        @handleDone="showDone = true"
      />
      <answer-content
        :questionList="questionList"
        :selectedIndex="selectedIndex"
        :handleTyping="handleTyping"
       />
    </div>
    <hand-in-dialog
      :showDone="showDone"
      @handleClose="showDone = false"
    />
  </div>
  <loading v-else />
</template>

<script>
import SideBarItem from '@/components/answer/SideBarItem';
import FabGroup from '@/components/answer/fab/FabGroup';
import HandInDialog from '@/components/answer/HandInDialog';
import Loading from '@/components/common/Loading';
import AnswerContent from '@/components/answer/AnswerContent';
import DebounceConstructor from '@/utils/debounce.js';
import { submit } from '@/api/index.js';

export default {
  name: 'Answer',
  components: {
    SideBarItem,
    FabGroup,
    Loading,
    HandInDialog,
    AnswerContent,
  },
  methods: {
    handleQuestionSwitch(isUp = true) {
      this.handleExecute();
      if (isUp) {
        this.selectedIndex--;
      } else {
        this.selectedIndex++;
      }
    },
  },
  computed: {
    questionList() {
      return this.$store.state.questionArray;
    },
  },
  data() {
    const {
      Debounce: handleTyping, Clear: handleExecute,
    } = DebounceConstructor((val, index) => {
      submit(this.questionList[index].id, val);
      this.$store.commit('handleAnswerChange', { value: val, index });
    }, 800);
    return {
      handleTyping,
      handleExecute,
      selectedIndex: 0,
      showDone: false,
    };
  },
  async mounted() {
    const { questionList, selectedIndex } = this;
    if (!questionList.length || questionList[selectedIndex].answer === undefined) {
      await this.$store.dispatch('init');
    }
  },
};
</script>

<style lang="stylus">
::-webkit-scrollbar
  width: 10px;
/* 滚动槽 */
::-webkit-scrollbar-track
  background-color #ECEFF1
  border-radius: 4px;
/* 滚动条滑块 */
::-webkit-scrollbar-thumb
  border-radius: 4px;
  background: #bbb;

.answer-container
  display flex
  .v-label--active
    font-size 23px
  .answer-sidebar-container
    padding-top 10px
    height calc(100vh - 80px)
    width 300px
    overflow-x hidden
    overflow-y auto
    z-index 2
  .answer-content::-webkit-scrollbar
    width: 0 !important
  .answer-content
    overflow-x hidden
    overflow-y auto
    height calc(100vh - 80px)
    width 100%
    padding 1rem
    padding-bottom 40px
    background-color #f5f5f5
    z-index 1
    .answer-content-card
      margin-top 1rem
      padding 1rem
      .answer-content-card-textarea textarea
        font-size 23px
        line-height 1.3
        letter-spacing 2px
      .answer-content-card-title
        user-select none
        font-size 36px
      .answer-content-card-text
        font-size 18px
      .answer-content-card-img-container
        margin 0 auto
        display flex
        flex-wrap wrap
        .answer-content-card-img
          cursor pointer
          width 40%
          margin 0 auto
      .answer-content-card-action
        display flex
        justify-content flex-start
</style>
