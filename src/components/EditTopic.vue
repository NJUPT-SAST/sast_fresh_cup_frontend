<template>
  <v-card class="editTopic">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSubmitSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >{{isSubmitSuccess? "提交成功！" : "提交失败，服务异常！"}}</v-snackbar>
    <v-snackbar v-model="isChoiceMax" right top :timeout="3000" color="error">数量已达上限！</v-snackbar>
    <v-btn
      fab
      dark
      color="success"
      fixed
      bottom
      right
      :loading="isSubmiting"
      :disable="isSubmiting"
      @click="handleSubmit"
    >
      <v-icon dark>check</v-icon>
    </v-btn>
    <div class="headline">题目编辑
      <v-btn
        color="blue-grey"
        class="white--text upload-btn"
      >上传
        <v-icon right dark>cloud_upload</v-icon>
      </v-btn>
    </div>
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
        <v-textarea
          v-model="topicContent"
          box
          label="题目内容"
          prepend-inner-icon="notes"
          height="calc(39vh)"
        />
      </div>
      <div class="right-part">
        <v-btn fab dark small color="primary" style="margin-top: -4rem" @click="addChoice">
          <v-icon dark>playlist_add</v-icon>
        </v-btn>
        <div class="topic-choice-groups">
          <template v-for="(item, index) in topicChoice">
            <div class="topic-choice" :key="index">
              <div class="choice-content">
                <v-text-field v-model="item.content" :label="item.label" clearable>
                  <template v-slot:append>
                    <v-btn
                      fab
                      dark
                      color="error"
                      v-if="item.deleteBtn"
                      @click="removeChoice"
                      :id="index"
                      style="width: 30px; height: 30px;"
                    >
                      <v-icon dark :id="index">remove</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </v-card>
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
    isChoiceMax: false,
  }),
  methods: {
    addChoice() {
      if (this.topicChoice.length < 10) {
        this.topicChoice.push({
          label: '额外选项',
          content: '',
          deleteBtn: true,
        });
      } else {
        this.isChoiceMax = true;
      }
    },
    removeChoice(e) {
      const { id } = e.target;
      this.topicChoice.splice(id, 1);
      if (this.topicChoice.length < 10) {
        this.isChoiceMax = false;
      }
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
  padding 3rem
  width 103%
  overflow-x auto
  .headline
    margin-bottom 0.5rem
    .upload-btn
      margin-left 2rem
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
      .topic-choice-groups
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content space-between
        align-items flex-start
        height auto
        margin-right 1rem
      .topic-choice
        display flex
        justify-content space-between
        height 80px
        margin-bottom 1rem
        margin-top -0.4rem
        .choice-content
          width 15vw
</style>
