<template>
  <v-card class="editTopic">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSubmitSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >{{isSubmitSuccess? "提交成功！" : "提交失败，服务异常！"}}</v-snackbar>
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
      <v-btn color="blue-grey" class="white--text upload-btn" @click="$refs.upload.click()">
        上传
        <input
          type="file"
          style="width: 0; height: 0; visiable: hidden"
          ref="upload"
          @change="handleUpload"
          accept=".xlsx"
        >
        <v-icon right dark>cloud_upload</v-icon>
      </v-btn>
    </div>
    <div class="edit-part">
      <div class="left-part">
        <v-select
          v-model="departmentChoice"
          class="department-choice"
          :items="departmentOptions"
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
      <v-card class="right-part">
        <v-tabs
          v-model="activeTab"
          color="primary"
          slider-color="yellow"
          dark
          style="width: 100%"
          grow
        >
          <v-btn icon dark color="primary" @click="addOptions">
            <v-icon dark>playlist_add</v-icon>
          </v-btn>
          <v-tab v-for="(tab, index) in tabsOptions" :key="index">{{tab}}</v-tab>
          <v-tab-item>
            <div class="choice-part">
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
                            @click="removeOptions"
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
          </v-tab-item>
          <v-tab-item>
            <div class="img-part">
              <template v-for="(item, index) in imageGroups">
                <div class="topic-img" :key="index">
                  <v-text-field v-model="item.address" label="图片地址" clearable>
                    <template v-slot:append>
                      <v-btn
                        fab
                        dark
                        color="error"
                        v-if="item.deleteBtn"
                        @click="removeOptions"
                        :id="index"
                        style="width: 30px; height: 30px;"
                      >
                        <v-icon dark :id="index">remove</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </template>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="annex-part">
              <template v-for="(item, index) in annexGroups">
                <div class="topic-annex" :key="index">
                  <v-text-field v-model="item.address" label="附件地址" clearable>
                    <template v-slot:append>
                      <v-btn
                        fab
                        dark
                        color="error"
                        v-if="item.deleteBtn"
                        @click="removeOptions"
                        :id="index"
                        style="width: 30px; height: 30px;"
                      >
                        <v-icon dark :id="index">remove</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </template>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import XLSX from 'xlsx';

export default {
  data: () => ({
    isSnackBarShow: false,
    isSubmitSuccess: false,
    isSubmiting: false,
    departmentOptions: ['软件研发中心', '电子部', '办公部门'],
    tabsOptions: ['选项', '图片', '附件'],
    activeTab: null,
    departmentChoice: '',
    topicTitle: '',
    topicContent: '',
    topicChoice: [
      { label: '选项一', content: '', deleteBtn: false },
      { label: '选项二', content: '', deleteBtn: false },
      { label: '选项三', content: '', deleteBtn: false },
      { label: '选项四', content: '', deleteBtn: false },
      { label: '额外选项', content: '', deleteBtn: true },
    ],
    // 提交单道题目时使用
    submitTopic: {
      department: '',
      title: '',
      content: '',
      options: [],
      images: [],
      annexs: [],
    },
    // 上传Excel时将 submitTopic push 进这个数组一起提交
    topicGroups: [],
    imageGroups: [
      { address: '', deleteBtn: false },
      { address: '', deleteBtn: false },
      { address: '', deleteBtn: true },
    ],
    annexGroups: [
      { address: '', deleteBtn: false },
      { address: '', deleteBtn: false },
      { address: '', deleteBtn: true },
    ],
    errorMsg: '',
  }),
  methods: {
    addOptions() {
      console.log(this.activeTab);
      switch (this.activeTab) {
      case 0:
        this.topicChoice.push({
          label: '额外选项',
          content: '',
          deleteBtn: true,
        });
        break;
      case 1:
        this.imageGroups.push({
          address: '',
          deleteBtn: true,
        });
        break;
      case 2:
        this.annexGroups.push({
          address: '',
          deleteBtn: true,
        });
        break;
      default:
        break;
      }
    },
    removeOptions(e) {
      const { id } = e.target;
      switch (this.activeTab) {
      case 0:
        this.topicChoice.splice(id, 1);
        break;
      case 1:
        this.imageGroups.splice(id, 1);
        break;
      case 2:
        this.annexGroups.splice(id, 1);
        break;
      default:
        break;
      }
    },
    init() {
      this.activeTab = 0;
      this.departmentChoice = '';
      this.topicTitle = '';
      this.topicContent = '';
      this.topicChoice = [
        { label: '选项一', content: '', deleteBtn: false },
        { label: '选项二', content: '', deleteBtn: false },
        { label: '选项三', content: '', deleteBtn: false },
        { label: '选项四', content: '', deleteBtn: false },
        { label: '额外选项', content: '', deleteBtn: true },
      ];
      this.submitTopic = {
        department: '',
        title: '',
        content: '',
        options: [],
      };
      this.topicGroups = [];
      this.imageGroups = [
        { address: '', deleteBtn: false },
        { address: '', deleteBtn: false },
        { address: '', deleteBtn: true },
      ];
      this.annexGroups = [
        { address: '', deleteBtn: false },
        { address: '', deleteBtn: false },
        { address: '', deleteBtn: true },
      ];
      this.errorMsg = '';
    },
    handleSubmit() {
      this.isSubmiting = true;
      this.submitTopic.department = this.departmentChoice;
      this.submitTopic.title = this.topicTitle;
      this.submitTopic.content = this.topicContent;
      this.topicChoice.forEach((item) => {
        this.submitTopic.options.push(item.content);
      });
      this.imageGroups.forEach((item) => {
        this.submitTopic.images.push(item);
      });
      this.annexGroups.forEach((item) => {
        this.submitTopic.annexs.push(item);
      });
      setTimeout(() => {
        this.isSubmiting = false;
        this.isSnackBarShow = true;
        this.isSubmitSuccess = false; // true
        this.init();
      }, 3000);
    },
    handleUpload(e) {
      const { files } = e.target;
      if (files) {
        /**
         * 选取多个文件时分几次上传
         */
        Object.keys(files).forEach((key) => {
          const fileReader = new FileReader();
          fileReader.onload = (ev) => {
            try {
              const data = ev.target.result;
              const workbook = XLSX.read(data, { type: 'binary' });
              const workSheetName = workbook.SheetNames[0];
              const sheetOutput = XLSX.utils.sheet_to_json(workbook.Sheets[workSheetName]);
              sheetOutput.forEach((item) => {
                this.submitTopic = {};
                this.submitTopic.options = [];
                this.submitTopic.images = [];
                this.submitTopic.annexs = [];
                Object.keys(item).forEach((itemKey) => {
                  if (itemKey.indexOf('部门') !== -1) {
                    this.submitTopic.department = item[itemKey];
                  } else if (itemKey.indexOf('标题') !== -1) {
                    this.submitTopic.title = item[itemKey];
                  } else if (itemKey.indexOf('内容') !== -1) {
                    this.submitTopic.content = item[itemKey];
                  } else if (itemKey.indexOf('选项') !== -1) {
                    this.submitTopic.options.push(item[itemKey]);
                  } else if (itemKey.indexOf('图片') !== -1) {
                    this.submitTopic.images.push(item[itemKey]);
                  } else if (itemKey.indexOf('附件') !== -1) {
                    this.submitTopic.annexs.push(item[itemKey]);
                  }
                });
                this.topicGroups.push(this.submitTopic);
              });
              console.log(this.topicGroups);
              /**
               * 在这里上传, Array<object> 形式
               */
              this.topicGroups = [];
            } catch (error) {
              this.errorMsg = error;
              console.log(error);
            }
          };
          fileReader.readAsBinaryString(files[key]);
        });
      }
    },
  },
};
</script>

<style lang="stylus">
.editTopic
  padding 3rem
  width 103%
  height 100%
  overflow-x auto
  overflow-y auto
  .headline
    margin-bottom 0.5rem
    .upload-btn
      margin-left 2rem
      width 100px
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
      display flex
      flex-wrap wrap
      justify-content space-between
      width 50%
      height 60vh
      margin-right 1rem
      overflow-y auto
      .choice-part
        padding 2rem
        .topic-choice-groups
          display flex
          flex-direction row
          flex-wrap wrap
          justify-content space-between
          align-items flex-start
          margin-right 1rem
        .topic-choice
          display flex
          justify-content space-between
          height 80px
          margin-bottom 1rem
          margin-top -0.4rem
          .choice-content
            width 200px
      .img-part
        width 80%
        padding 2rem
      .annex-part
        width 80%
        padding 2rem
</style>
