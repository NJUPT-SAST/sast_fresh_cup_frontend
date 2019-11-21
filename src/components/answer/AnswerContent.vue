<template>
  <div ref="content">
    <v-card class="answer-content-card">
      <v-card-title class="answer-content-card-title">
        {{title}}
      </v-card-title>
      <v-card-text class="answer-content-card-text">
        <div v-html="content">
          {{content}}
        </div>
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
          @click.stop="showResetDialog = true"
        >重置</v-btn>
      </v-card-actions>
    </v-card>
    <answer-dialog
      :hidden="!showResetDialog"
      title="确认重置"
      content="是否要重置？"
      confirm="确认重置"
      deny="取消"
      @handleDeny=" showResetDialog = false"
      @handleConfirm="handleReset"
    />
  </div>
</template>
<script>
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import { baseURL } from '@/api/index.js';
import AnswerDialog from '@/components/answer/AnswerDialog';

export default {
  name: 'AnswerContent',
  components: {
    AnswerDialog,
  },
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
  computed: {
    title() {
      return `${this.selectedIndex + 1}. ${this.questionList[this.selectedIndex].title}`;
    },
    content() {
      return marked(this.questionList[this.selectedIndex].content);
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
      this.handleTyping(e, this.selectedIndex);
    },
    handleReset() {
      this.handleValueChange('');
      this.showResetDialog = false;
    },
    marked,
  },
  data() {
    return {
      baseURL,
      showResetDialog: false,
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
  mounted() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value;
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      smartypants: true,
      xhtml: false,
    });
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
  // .answer-content-card-text
  //   font-size 18px
  .answer-content-card-img-container
    margin 0 auto
    display flex
    flex-wrap wrap
    padding-top 20px
    .answer-content-card-img
      cursor pointer
      width 40%
      margin 0 auto
  .answer-content-card-action
    display flex
    justify-content flex-start
table
  border-collapse: collapse
  margin: 0 auto
  text-align: center
  td,th
    border: 1px solid #cad9ea
    color: #666
    height: 30px
  thead,th
    background-color: #CCE8EB
    width: 100px
  tr:nth-child(odd)
    background: #fff
  tr:nth-child(even)
    background: #F5FAFA
</style>
