<template>
  <v-card class="addTopic elevation-3">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSubmitSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >{{isSubmitSuccess? "添加成功！" : "添加失败，服务异常！"}}</v-snackbar>
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
    <div class="headline">题目添加
      <v-btn
        color="blue-grey"
        class="white--text upload-btn"
        @click="$refs.upload.click()"
        :loading="isUploading"
        :disabled="isUploading"
      >
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
      <v-dialog v-model="downloadDialog" persistent max-width="300">
        <template v-slot:activator="{ on }">
          <v-btn color="blue-grey" class="white--text upload-btn" v-on="on">下载模板</v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">下载前须知：</v-card-title>
          <v-divider />
          <v-card-text>
            <div>1.若有额外选项请在第一行添加字样为“额外选项”的单元格；</div>
            <div class="red--text">2.请勿合并单元格，否则将导致解析错误；</div>
            <div>3.选项内容可为空，即为填空题；</div>
            <div class="red--text">4.题目标题与内容必填；</div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" flat @click="downloadDialog = false">取消</v-btn>
            <v-btn color="green darken-1" flat @click="handleDownload">下载</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="add-part">
      <div class="left-part">
        <v-text-field
          class="topic-title"
          v-model="submitTopic.title"
          label="题目标题"
          prepend-inner-icon="title"
        />
        <v-textarea
          v-model="submitTopic.content"
          box
          label="题目内容"
          prepend-inner-icon="notes"
          height="370"
        />
      </div>
      <v-card class="right-part">
        <v-tabs
          v-model="activeTab"
          color="primary"
          slider-color="yellow"
          dark
          style="width: 100%"
          show-arrows
          grow
        >
          <v-tab v-for="(tab, index) in tabsOptions" :key="index">{{tab}}</v-tab>
          <v-tab-item>
            <div class="choice-part">
              <v-btn flat icon color="primary" @click="addOption" style="margin-bottom: 1rem">
                <v-icon>playlist_add</v-icon>
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
                            @click="removeOption"
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
        </v-tabs>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import XLSX from 'xlsx';
import { modifyQuestions, modifyQuestionsMassively } from '@/api/index';
import template from '../../assets/template.xlsx';

export default {
  data: () => ({
    isSnackBarShow: false,
    isSubmitSuccess: false,
    isUploading: false,
    isSubmiting: false,
    downloadDialog: false,
    tabsOptions: ['选项'],
    activeTab: null,
    topicChoice: [
      { label: '选项一', content: '', deleteBtn: false },
      { label: '选项二', content: '', deleteBtn: false },
      { label: '选项三', content: '', deleteBtn: false },
      { label: '选项四', content: '', deleteBtn: false },
    ],
    // 提交单道题目时使用
    submitTopic: {
      title: '',
      content: '',
      options: [],
    },
    // 上传Excel时将 submitTopic push 进这个数组，用 Array<object> 提交
    topicGroups: [],
    template,
  }),
  methods: {
    addOption() {
      this.topicChoice.push({
        label: '额外选项',
        content: '',
        deleteBtn: true,
      });
    },
    removeOption(e) {
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
    clearData() {
      this.errorMsg = '';
      this.activeTab = 0;
      this.topicChoice = [
        { label: '选项一', content: '', deleteBtn: false },
        { label: '选项二', content: '', deleteBtn: false },
        { label: '选项三', content: '', deleteBtn: false },
        { label: '选项四', content: '', deleteBtn: false },
      ];
      this.submitTopic = {
        title: '',
        content: '',
        options: [],
      };
      this.topicGroups = [];
    },
    async handleSubmit() {
      this.isSubmiting = true;
      this.topicChoice.forEach((item) => {
        if (item.content !== '') {
          this.submitTopic.options.push(item.content);
        }
      });
      const { title, content, options } = this.submitTopic;
      await modifyQuestions(title, content, options)
        .then((res) => {
          this.isSubmiting = false;
          this.isSnackBarShow = true;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.clearData();
            this.isSubmitSuccess = true;
          } else {
            this.isSubmitSuccess = false;
          }
        })
        .catch((err) => {
          this.isSubmitSuccess = false;
          this.isSubmiting = false;
          this.isSnackBarShow = true;
        });
    },
    handleUpload(e) {
      this.isUploading = true;
      const { files } = e.target;
      if (files.length !== 0) {
        const fileReader = new FileReader();
        fileReader.onload = async (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const workSheetName = workbook.SheetNames[0];
            const sheetOutput = XLSX.utils.sheet_to_json(workbook.Sheets[workSheetName]);
            sheetOutput.forEach((item) => {
              const tempSubmitTopic = {
                title: '',
                content: '',
                options: [],
              };
              Object.keys(item).forEach((itemKey) => {
                if (itemKey.indexOf('标题') !== -1) {
                  tempSubmitTopic.title = item[itemKey];
                } else if (itemKey.indexOf('内容') !== -1) {
                  tempSubmitTopic.content = item[itemKey];
                } else if (itemKey.indexOf('选项') !== -1) {
                  if (item[itemKey] !== '') {
                    tempSubmitTopic.options.push(item[itemKey]);
                  }
                }
              });
              this.topicGroups.push(tempSubmitTopic);
            });
            await modifyQuestionsMassively(this.topicGroups).then((res) => {
              this.isUploading = false;
              this.isSnackBarShow = true;
              const { ret, desc } = res;
              if (ret === 200 && desc === 'successful') {
                this.clearData();
                this.isSubmitSuccess = true;
              } else {
                this.isSubmitSuccess = false;
              }
            });
          } catch (error) {
            this.isUploading = false;
            this.isSnackBarShow = true;
            this.isSubmitSuccess = false;
          }
        };
        fileReader.readAsBinaryString(files[0]);
      }
    },
    handleDownload() {
      this.downloadDialog = false;
      window.location.href = this.template;
    },
  },
};
</script>

<style lang="stylus">
.addTopic
  padding 3rem
  width 93%
  height 600px
  .headline
    margin-bottom 0.5rem
    .upload-btn
      margin-left 2rem
      width 100px
  .add-part
    display flex
    flex-direction row
    justify-content space-between
    width 100%
    .left-part
      width 40%
      .topic-title
        width 80%
        margin-bottom 1rem
    .right-part
      display flex
      flex-wrap wrap
      justify-content space-between
      width 48%
      height 450px
      .choice-part
        padding 2rem
        height 402px
        overflow-y auto
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
        display flex
        flex-direction column
        align-items center
        width 80%
        margin 0 auto
        padding 2rem
        .img-groups
          width 100%
          height 280px
          margin-top 1rem
          .img-list
            height 224px
            overflow-y auto
      .annex-part
        display flex
        flex-direction column
        align-items center
        width 80%
        margin 0 auto
        padding 2rem
        .annex-groups
          width 100%
          height 280px
          margin-top 1rem
          .annex-list
            height 224px
            overflow-y auto
</style>
