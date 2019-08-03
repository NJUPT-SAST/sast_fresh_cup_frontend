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
      <v-card class="anwer-content-card">
        <v-card-title class="answer-content-card-title">
          {{questionList[selectedIndex].title}}
        </v-card-title>
        <v-card-text class="answer-content-card-text">
          {{questionList[selectedIndex].content}}
        </v-card-text>
        <v-textarea
          outlined
          label="请填写答案"
          rows="10"
          no-resize
          v-model="answer"
        ></v-textarea>
        <v-card-actions class="answer-content-card-action">
          <v-btn color="grey" style="margin-right:20px;color:white" @click="answer= ''">重置</v-btn>
          <v-btn color="success" style="margin-right:20px">提交</v-btn>
        </v-card-actions>
      </v-card>
      <div class="answer-content-btn-container">
        <v-btn
          :disabled="selectedIndex === 0"
          @click="selectedIndex--"
        >上一题</v-btn>
        <v-btn
          :disabled="selectedIndex === questionList.length-1"
          @click="selectedIndex++"
        >下一题</v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.answer-container
  display flex
  .answer-sidebar-container
    padding-top 10px
    height calc(100vh - 80px)
    width 400px
    overflow-x hidden
    overflow-y auto
    z-index 2
  .answer-content
    overflow-x hidden
    overflow-y auto
    height calc(100vh - 80px)
    width 100%
    padding 1rem
    padding-bottom 20px
    background-color #f5f5f5
    z-index 1
    .anwer-content-card
      padding 1rem
      .answer-content-card-title
        font-size 36px
      .answer-content-card-text
        min-height 40vh
        font-size 20px
      .answer-content-card-action
        display flex
        justify-content flex-end
    .answer-content-btn-container
      display flex
      width 100%
      padding-left 20px
      padding-right 20px
      justify-content space-between
</style>

<script>
import SideBarItem from '../components/SideBarItem';

export default {
  name: 'Answer',
  components: {
    SideBarItem,
  },
  data() {
    return {
      selectedIndex: 0,
      answer: '',
      questionList: [
        {
          title: 'question1',
          content: '1这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          title: 'question2',
          content: '2这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          title: 'question3',
          content: '3这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          title: 'question4',
          content: '4这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          title: 'question1',
          content: '5这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: true,
        },
        {
          title: 'question2',
          content: '6这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question3',
          content: '7这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question4',
          content: '8这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question1',
          content: '9这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question2',
          content: '10这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question3',
          content: '11这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question4',
          content: '12这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question2',
          content: '10这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question3',
          content: '11这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
        {
          title: 'question4',
          content: '12这是一道题目的内容，它很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
          answered: false,
        },
      ],
    };
  },
};
</script>
