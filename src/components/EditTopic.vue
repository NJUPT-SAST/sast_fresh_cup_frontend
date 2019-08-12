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
          height="49vh"
        />
      </div>
      <v-card class="right-part">
        <v-tabs
          v-model="activeTab"
          color="primary"
          slider-color=yellow
          dark
          style="width: 100%"
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
          <v-tab-item>
            <div class="img-part">
              <input
                type="file"
                ref="image"
                accept=".jpg, .jpeg, .png"
                name="image"
                @change="handleFile"
                style="width: 0; height: 0; visiable: hidden"
              >
              <v-btn @click="$refs.image.click()">添加文件</v-btn>
              <v-card class="img-groups">
                <v-list subheader>
                  <v-subheader>
                    <v-icon medium style="margin-right: .5rem">list</v-icon>文件列表
                  </v-subheader>
                  <v-divider light></v-divider>
                  <v-list-tile v-for="(item, index) in imageGroups" :key="index" @click.stop>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.fileName"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn
                        fab
                        ripple
                        color="error"
                        style="width: 30px; height: 30px;"
                        @click="removeOption"
                        :id="index"
                      >
                        <v-icon dark :id="index">remove</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="annex-part">
              <input
                type="file"
                ref="annex"
                name="annex"
                @change="handleFile"
                style="width: 0; height: 0; visiable: hidden"
              >
              <v-btn @click="$refs.annex.click()">添加文件</v-btn>
              <v-card class="annex-groups">
                <v-list subheader>
                  <v-subheader>
                    <v-icon medium style="margin-right: .5rem">list</v-icon>文件列表
                  </v-subheader>
                  <v-divider light></v-divider>
                  <v-list-tile v-for="(item, index) in annexGroups" :key="index" @click.stop>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.fileName"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn
                        fab
                        ripple
                        color="error"
                        style="width: 30px; height: 30px;"
                        @click="removeOption"
                        :id="index"
                      >
                        <v-icon dark :id="index">remove</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
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
    errorMsg: '',
    tabsOptions: ['选项', '图片', '附件'],
    activeTab: null,
    topicChoice: [
      { label: '选项一', content: '', deleteBtn: false },
      { label: '选项二', content: '', deleteBtn: false },
      { label: '选项三', content: '', deleteBtn: false },
      { label: '选项四', content: '', deleteBtn: false },
    ],
    imageGroups: [],
    annexGroups: [],
    // 提交单道题目时使用
    submitTopic: {
      title: '',
      content: '',
      options: [],
      images: [],
      annexs: [],
    },
    // 上传Excel时将 submitTopic push 进这个数组，用 Array<object> 提交
    topicGroups: [],
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
        image: [],
        annex: [],
      };
      this.topicGroups = [];
    },
    handleFile(e) {
      const { name, files } = e.target;
      if (files.length !== 0) {
        if (name === 'image') {
          this.imageGroups.push({
            fileName: files[0].name,
            file: files[0],
          });
        } else if (name === 'annex') {
          this.annexGroups.push({
            fileName: files[0].name,
            file: files[0],
          });
        }
      }
    },
    handleSubmit() {
      this.isSubmiting = true;
      this.topicChoice.forEach((item) => {
        if (item.content !== '') {
          this.submitTopic.options.push(item.content);
        }
      });
      this.imageGroups.forEach((item) => {
        if (item.file !== null) {
          this.submitTopic.images.push(item.file);
        }
      });
      this.annexGroups.forEach((item) => {
        if (item.file !== null) {
          this.submitTopic.annexs.push(item.file);
        }
      });
      console.log(this.submitTopic);
      setTimeout(() => {
        this.isSubmiting = false;
        this.isSnackBarShow = true;
        this.isSubmitSuccess = false; // true
        this.clearData();
      }, 3000);
    },
    handleUpload(e) {
      const { files } = e.target;
      if (files.length !== 0) {
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const workSheetName = workbook.SheetNames[0];
            const sheetOutput = XLSX.utils.sheet_to_json(workbook.Sheets[workSheetName]);
            sheetOutput.forEach((item) => {
              // push 进一题后清空(批量添加时不需要 image 和 annex)
              this.submitTopic = {
                title: '',
                content: '',
                options: [],
              };
              Object.keys(item).forEach((itemKey) => {
                if (itemKey.indexOf('标题') !== -1) {
                  this.submitTopic.title = item[itemKey];
                } else if (itemKey.indexOf('内容') !== -1) {
                  this.submitTopic.content = item[itemKey];
                } else if (itemKey.indexOf('选项') !== -1) {
                  if (item[itemKey] !== '') {
                    this.submitTopic.options.push(item[itemKey]);
                  }
                }
              });
              this.topicGroups.push(this.submitTopic);
            });
            console.log(this.topicGroups);
            /**
             * 在这里上传, Array<object> 形式
             */
            // 上传结束后清空数据
            this.clearData();
          } catch (error) {
            this.errorMsg = error;
            console.log(error);
          }
        };
        fileReader.readAsBinaryString(files[0]);
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
          overflow-y auto
</style>
