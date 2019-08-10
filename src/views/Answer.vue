<template>
  <div class="answer-container">
    <div class="answer-sidebar-container elevation-3">
      <side-bar-item
        v-for="(item,index) in questionList"
        :key="index"
        :text="item.title"
        :answered="item.answered"
        :selected="selectedIndex === index"
        @click="selectedIndex = index"
      />
    </div>
    <div class="answer-content">
      <fab-group />
      <div ref="content">
        <v-card class="anwer-content-card">
          <v-card-title class="answer-content-card-title">
            {{questionList[selectedIndex].title}}
          </v-card-title>
          <v-card-text class="answer-content-card-text">
            {{questionList[selectedIndex].content}}
            <div
              class="answer-content-card-img-container"
              v-if="questionList[selectedIndex].image"
            >
              <img
                class="answer-content-card-img elevation-1"
                v-for="(item,index) in questionList[selectedIndex].image"
                :src="item"
                :key="index"
                alt=""
                @click="newTab(item)"
              >
            </div>
            <div
              class="answer-content-card-attachment"
              v-if="questionList[selectedIndex].attachment"
            >
              <v-btn
                v-for="(item,index) in questionList[selectedIndex].attachment"
                :key="index"
                @click="newTab(item.uri)"
                color="#90CAF9"
                style="color:white"
              >
                {{item.text}}
              </v-btn>
            </div>
          </v-card-text>
          <v-textarea
            outlined
            label="请填写答案"
            rows="10"
            no-resize
            v-model="answer"
          ></v-textarea>
          <v-card-actions class="answer-content-card-action">
            <v-btn
              color="grey"
              style="margin-right:40px;color:white"
              @click="answer= ''"
            >重置</v-btn>
            <v-btn color="success" style="margin-right:120px">提交</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div class="answer-content-btn-container">
        <v-btn
          :disabled="selectedIndex === 0"
          @click="selectedIndex--"
          style="width: 300px"
          large
          color="#CFD8DC"
        >上一题</v-btn>
        <v-btn
          :disabled="selectedIndex === questionList.length-1"
          @click="selectedIndex++"
          style="width:300px"
          large
          color="#CFD8DC"
        >下一题</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import SideBarItem from '../components/SideBarItem';
import FabGroup from '../components/FabGroup';
import ThrottleConstructor from '../utils/throttle.js';
import { submit } from '../api/index.js';

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
  },
  watch: {
    selectedIndex() {
      if (this.$refs.content) {
        this.$refs.content.classList.remove('animated', 'fadeIn');
        setInterval(() => {
          this.$refs.content.classList.add('animated', 'fadeIn');
        });
      }
    },
    answer(val) {
      this.handleTyping(val);
    },
  },
  computed: {
    questions() {
      return this.$store.state.questionArray;
    },
  },
  data() {
    const {
      Throttle: handleTyping, Clear: handleExecute,
    } = ThrottleConstructor((val) => {
      submit(this.questionList[this.selectedIndex].id, val);
    }, 200);
    return {
      selectedIndex: 0,
      answer: '',
      handleTyping,
      handleExecute,
      questionList: [
        {
          id: 0,
          title: 'question1',
          content: '1这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          id: 1,
          title: 'question2',
          content: '2这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
          image: ['https://open.saintic.com/api/bingPic/', 'https://open.saintic.com/api/bingPic/'],
        },
        {
          id: 2,
          title: 'question3',
          content: '3这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
          attachment: [
            {
              text: '这是个附件',
              uri: 'https://open.saintic.com/api/bingPic/',
            },
          ],
        },
        {
          id: 3,
          title: 'question4',
          content: '4这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          id: 4,
          title: 'question1',
          content: '5这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          id: 5,
          title: 'question2',
          content: '6这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 6,
          title: 'question3',
          content: '7这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 7,
          title: 'question4',
          content: '8这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 8,
          title: 'question1',
          content: '9这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 9,
          title: 'question2',
          content: '10这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 10,
          title: 'question3',
          content: '11这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 11,
          title: 'question4',
          content: '12这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 12,
          title: 'question2',
          content: '10这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 13,
          title: 'question3',
          content: '11这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          id: 14,
          title: 'question4',
          content: '12这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
      ],
    };
  },
};
</script>

<style lang="stylus">
.answer-container
  display flex
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
    .anwer-content-card
      padding 1rem
      .answer-content-card-title
        font-size 36px
      .answer-content-card-text
        min-height 40vh
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
        justify-content flex-end
    .answer-content-btn-container
      display flex
      margin 0 auto
      width 70%
      padding-left 20px
      padding-right 20px
      justify-content space-between
</style>
