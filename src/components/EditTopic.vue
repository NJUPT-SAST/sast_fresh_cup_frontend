<template>
  <div class="editTopic">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSubmitSuccess? 'success' : 'error'"
      :right="true"
      :top="true"
      :timeout="3000"
    >{{isSubmitSuccess? "提交成功！" : "提交失败，服务异常！"}}</v-snackbar>
    <v-btn
      fab
      dark
      color="success"
      absolute
      bottom
      right
      :loading="isSubmiting"
      :disable="isSubmiting"
      @click="handleSubmit"
    >
      <v-icon dark>check</v-icon>
    </v-btn>
    <div class="headline">题目编辑</div>
    <div class="edit-part">
      <div class="left-part">
        <v-select
          v-model="departmentChoice"
          class="department-choice"
          :items="department"
          label="部门"
          prepend-inner-icon="people"
        />
        <v-text-field
          class="topic-title"
          v-model="topicTitle"
          label="题目标题"
          prepend-inner-icon="title"
        />
        <v-textarea v-model="topicContent" box label="题目内容" prepend-inner-icon="notes" auto-grow/>
      </div>
      <div class="right-part">
        <v-btn fab dark small color="primary" style="margin-top: -4rem" @click="addChoice">
          <v-icon dark>playlist_add</v-icon>
        </v-btn>
        <template v-for="(item, index) in topicChoice">
          <div class="topic-choice" :key="index">
            <div class="choice-content">
              <v-text-field v-model="item.content" :label="item.label"/>
            </div>
            <v-btn
              fab
              dark
              small
              color="error"
              v-if="item.deleteBtn"
              @click="removeChoice"
              :id="index"
            >
              <v-icon dark :id="index">remove</v-icon>
            </v-btn>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isSnackBarShow: false,
    isSubmitSuccess: false,
    isSubmiting: false,
    department: ['软件研发中心', '电子部', '办公部门'],
    departmentChoice: '',
    topicTitle: '',
    topicContent: '',
    topicChoice: [
      { label: '选项一', content: '', deleteBtn: false },
      { label: '选项二', content: '', deleteBtn: false },
      { label: '选项三', content: '', deleteBtn: false },
      { label: '选项四', content: '', deleteBtn: false },
    ],
  }),
  methods: {
    addChoice() {
      this.topicChoice.push({
        label: '额外选项',
        content: '',
        deleteBtn: true,
      });
    },
    removeChoice(e) {
      const { id } = e.target;
      this.topicChoice.splice(id, 1);
    },
    handleSubmit() {
      this.isSubmiting = true;
      setTimeout(() => {
        this.isSubmiting = false;
        this.isSnackBarShow = true;
        this.isSubmitSuccess = false; // true
        this.departmentChoice = '';
        this.topicTitle = '';
        this.topicContent = '';
        this.topicChoice = [
          { label: '选项一', content: '', deleteBtn: false },
          { label: '选项二', content: '', deleteBtn: false },
          { label: '选项三', content: '', deleteBtn: false },
          { label: '选项四', content: '', deleteBtn: false },
        ];
      }, 3000);
    },
  },
};
</script>

<style lang="stylus">
.editTopic
  .headline
    margin-bottom 2rem
  .edit-part
    display flex
    flex-direction row
    justify-content space-between
    width 70vw
    .left-part
      width 40%
      .department-choice
        width 50%
      .topic-title
        width 80%
        margin-bottom 1rem
    .right-part
      width 50%
      .topic-choice
        display flex
        justify-content space-between
        width 60%
        margin-bottom 1rem
        margin-top -0.4rem
        .choice-content
          width 80%
</style>
