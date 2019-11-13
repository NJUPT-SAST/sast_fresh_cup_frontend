<template>
  <div ref="content">
    <v-card class="answer-content-card">
      <v-card-title class="answer-content-card-title">
        {{questionList[selectedIndex].title}}
      </v-card-title>
      <v-card-text class="answer-content-card-text"
        v-html="marked(questionList[selectedIndex].content.replace(/\n/g,'\n\n'))"
      >
        {{marked(questionList[selectedIndex].content.replace(/\n/g,'\n\n'))}}
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
</template>
<script>
import marked from 'marked';
import { baseURL } from '@/api/index.js';


export default {
  name: 'AnswerContent',
  props: {
    questionList: {
      type: Array,
      default: () => [],
    },
    selectedIndex: {
      type: Number,
      default: () => 0,
    },
    handleTyping: {
      type: Function,
      default: () => () => {},
    },
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
    marked,
  },
  data() {
    return {
      baseURL,
    };
  },
  watch: {
    selectedIndex(newIndex, OldIndex) {
      if (this.$refs.content.classList) {
        const direction = newIndex > OldIndex ? 'fadeInUp' : 'fadeInDown';
        this.$refs.content.classList.remove('animated', 'fadeInUp', 'fadeInDown', 'faster');
        setTimeout(() => {
          this.$refs.content.classList.add('animated', direction, 'faster');
        });
      }
    },
  },
};
</script>
<style lang="stylus">
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
