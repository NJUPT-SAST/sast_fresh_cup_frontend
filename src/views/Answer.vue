<template>
  <div
    class="answer-container"
    v-if="questionList.length && questionList[selectedIndex].answer !== undefined"
  >
    <div class="answer-sidebar-container elevation-3">
      <side-bar-item
        v-for="(item,index) in questionList"
        :key="index"
        :text="item.title"
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
      <div ref="content">
        <v-card class="answer-content-card">
          <v-card-title class="answer-content-card-title">
            {{questionList[selectedIndex].title}}
          </v-card-title>
          <v-card-text class="answer-content-card-text">
            {{questionList[selectedIndex].content}}
            <div
              class="answer-content-card-img-container"
              v-if="questionList[selectedIndex].images.length"
            >
              <img
                class="answer-content-card-img elevation-1"
                v-for="(item,index) in questionList[selectedIndex].images"
                :src="baseURL + item.url"
                :key="index"
                :alt="item.name"
                @click="newTab(baseURL + item.url)"
              >
            </div>
            <div
              class="answer-content-card-attachment"
              v-if="questionList[selectedIndex].attachments.length"
            >
              <v-btn
                v-for="(item,index) in questionList[selectedIndex].attachments"
                :key="index"
                @click="newTab(baseURL+item.url)"
                color="#90CAF9"
                style="color:white"
              >
                {{item.name}}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        <v-card class="answer-content-card">
          <v-textarea
            outlined
            label="请填写答案"
            rows="10"
            no-resize
            :value="questionList[selectedIndex].answer.content"
            @input="handleValueChange"
            v-if="!questionList[selectedIndex].options.length"
            class="answer-content-card-textarea"
          ></v-textarea>
          <v-radio-group
            v-else
            :mandatory="false"
            @change="handleValueChange"
            :value="questionList[selectedIndex].answer.content"
          >
            <v-radio
              v-for="(option,index) in questionList[selectedIndex].options"
              :key="index"
              :label="option"
              :value="option"
            ></v-radio>
          </v-radio-group>
          <v-card-actions class="answer-content-card-action">
            <v-btn
              color="grey"
              style="margin-right:40px;color:white"
              @click.stop="handleValueChange('')"
            >重置</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <!-- <div class="answer-content-btn-container">
        <v-btn
          :disabled="selectedIndex === 0"
          @click="handleQuestionSwitch(true)"
          style="width: 300px"
          large
          color="#CFD8DC"
        >上一题</v-btn>
        <v-btn
          :disabled="selectedIndex === questionList.length-1"
          @click="handleQuestionSwitch(false)"
          style="width:300px"
          large
          color="#CFD8DC"
        >下一题</v-btn>
      </div> -->
    </div>

  <v-dialog
      :value="showDone"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="headline">确认要提交交卷吗？</v-card-title>

        <v-card-text>是否确认要交卷？</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="error"
            text
            @click="showDone = false"
          >
            取消
          </v-btn>

          <v-btn
            color="green"
            text
            style="color:white"
            @click="$router.push({name:'homepage'})"
          >
            确认提交
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
  </div>
  <v-card v-else class="loading-card" height="100%" width="100vw">
    <v-progress-circular size="80" color="primary" indeterminate style="margin-bottom: 2rem"/>
    <span class="grey--text">努力加载中......</span>
  </v-card>
</template>

<script>
import SideBarItem from '../components/SideBarItem';
import FabGroup from '../components/FabGroup';
import DebounceConstructor from '../utils/debounce.js';
import { submit, baseURL } from '../api/index.js';

export default {
  name: 'Answer',
  components: {
    SideBarItem,
    FabGroup,
  },
  methods: {
    newTab(target) {
      window.open(target, '_blank');
    },
    handleValueChange(e) {
      this.$store.commit({
        type: 'handleAnswerChange',
        value: e,
        index: this.selectedIndex,
      });
      this.handleTyping(e);
    },
    handleQuestionSwitch(isUp = true) {
      this.handleExecute();
      if (isUp) {
        this.selectedIndex--;
      } else {
        this.selectedIndex++;
      }
    },
  },
  watch: {
    selectedIndex() {
      if (this.$refs.content.classList) {
        this.$refs.content.classList.remove('animated', 'fadeIn');
        setTimeout(() => {
          this.$refs.content.classList.add('animated', 'fadeIn');
        });
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
    } = DebounceConstructor((val) => {
      submit(this.questionList[this.selectedIndex].id, val);
      this.$store.commit('handleAnswerChange', { value: val, index: this.selectedIndex });
    }, 800);
    return {
      handleTyping,
      handleExecute,
      baseURL,
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
// ::-webkit-scrollbar-thumb:window-inactive
//   background: rgba(255,0,0,0.4);

.loading-card
  display flex
  flex-direction column
  justify-content center
  align-items center

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
    .answer-content-btn-container
      display flex
      margin 0 auto
      width 70%
      padding-left 20px
      padding-right 20px
      justify-content space-between
      margin-top 20px
</style>
