<template>
  <div class="editTopic elevation-3">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >{{isSuccess? successMsg : errMsg}}</v-snackbar>
    <v-dialog
      v-model="dialog.isOpen"
      scrollable
      persistent
      :width="openDialogType === dialog.type[1]? '50vw' : '350'"
    >
      <v-card color="primary" dark v-if="openDialogType === dialog.type[0]">
        <v-card-text>提交中...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
      <v-card v-else-if="openDialogType === dialog.type[1]" width="50vw">
        <v-card-title>
          <div class="headline">确认删除该图片？</div>
          <span class="grey--text">此操作不可逆！</span>
        </v-card-title>
        <v-card-text>
          <v-img
            :src="
              willDeleteIndex === -1
                ? ''
                : baseURL + topicGroups[activeTab].images[willDeleteIndex].url"
            class="grey darken-4"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="dialog.isOpen = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click="handleDeleteFile('image')">确认</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="openDialogType === dialog.type[2]">
        <v-card-title>
          <div class="headline">确认删除该附件？</div>
          <span class="grey--text">此操作不可逆！</span>
        </v-card-title>
        <v-card-text>
          {{
          willDeleteIndex === -1
          ? ''
          : topicGroups[activeTab].attachments[willDeleteIndex].name
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="dialog.isOpen = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click="handleDeleteFile('annex')">确认</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="openDialogType === dialog.type[3]">
        <v-card-title>
          <div class="headline">确认删除此题？</div>
          <span class="grey--text">此操作不可逆！</span>
        </v-card-title>
        <v-card-text>
          {{
          willDeleteIndex === -1
          ? ''
          : 'QUESTION' + topicGroups[activeTab].id
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="dialog.isOpen = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click="handleDeleteTopic">确认</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="openDialogType === dialog.type[4]">
        <v-card-title>选项列表</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;" v-if="topicGroups[activeTab].options.length !== 0">
          <template v-for="(option, index) in topicGroups[activeTab].options">
            <v-text-field
              v-model="topicGroups[activeTab].options[index]"
              :key="index"
              :disabled="!isEditing"
              placeholder="选项"
            >
              <template v-slot:append>
                <v-btn
                  fab
                  dark
                  color="error"
                  v-if="isEditing"
                  @click="removeOption"
                  :id="index"
                  style="width: 30px; height: 30px;"
                >
                  <v-icon dark :id="index">remove</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </template>
        </v-card-text>
        <v-card-text v-else style="height: 300px">
          <div class="no-file">
            <v-icon x-large style="margin-bottom: 1rem">speaker_notes_off</v-icon>
            <span class="grey--text">这里空空如也，快给它加上选项吧~</span>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn flat color="primary" @click="addOption" v-if="isEditing">添加选项</v-btn>
          <v-spacer/>
          <v-btn
            color="blue darken-1"
            flat
            @click="dialog.isOpen = false"
          >{{ isEditing? '保存' : '关闭'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input
      type="file"
      ref="image"
      accept=".jpg, .jpeg, .png"
      name="image"
      @change="handleAddFile"
      style="width: 0; height: 0; display: none"
    >
    <input
      type="file"
      ref="annex"
      name="attachment"
      @change="handleAddFile"
      style="width: 0; height: 0; display: none"
    >
    <v-toolbar color="blue" dark tabs height="64px">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="isSearchClick = !isSearchClick;" v-on="on" v-if="!isEditing">
            <v-icon>search</v-icon>
          </v-btn>
        </template>
        <span>搜索题目标题</span>
      </v-tooltip>
      <v-toolbar-title v-if="!isSearchClick || isEditing">题目编辑</v-toolbar-title>
      <v-autocomplete
        v-model="selectItem"
        v-else-if="isSearchClick && !isEditing"
        :loading="isSearching"
        :items="searchItems"
        :search-input.sync="searchContent"
        no-data-text="未找到内容"
        class="mx-3"
        flat
        hide-details
        cache-items
        autofocus
        clearable
        label="题目标题"
        solo-inverted
        style="margin-top: 10px"
      ></v-autocomplete>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="handleEditClick" v-on="on">
            <v-icon>{{isEditing? 'check' : 'edit'}}</v-icon>
          </v-btn>
        </template>
        <span>{{isEditing? '提交修改' : '编辑题目'}}</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            v-show="!isEditing"
            @click.stop="
              dialog.isOpen = true;
              willDeleteIndex = activeTab;
              openDialogType = 'deleteTopic'"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <span>删除题目</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon v-show="isEditing" @click="isEditing = false;">
            <v-icon>clear</v-icon>
          </v-btn>
        </template>
        <span>取消修改</span>
      </v-tooltip>
      <template v-slot:extension>
        <v-tabs v-model="activeTab" color="blue" show-arrows grow>
          <v-tabs-slider color="blue"></v-tabs-slider>
          <v-tab
            v-for="(topic, index) in topicGroups"
            :key="index"
            :disabled="isEditing"
          >{{ 'QUESTION' + (index + 1) }}</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-card class="loading-card" v-if="isGettingQuestions" height="calc(100% - 112px)">
      <v-progress-circular size="80" color="primary" indeterminate style="margin-bottom: 2rem"/>
      <span class="grey--text">努力加载中......</span>
    </v-card>
    <v-card
      class="loading-card"
      v-show="!isGetQuestionsSuccess && !isGettingQuestions"
      height="calc(100% - 112px)"
    >
      <v-icon x-large style="margin-bottom: 2rem" color="error">error</v-icon>
      <span class="grey--text">加载失败，请刷新页面重试！</span>
    </v-card>
    <v-tabs-items
      v-model="activeTab"
      class="topic"
      v-show="isGetQuestionsSuccess && !isGettingQuestions"
    >
      <v-tab-item v-for="(topic, index) in topicGroups" :key="index" style="height: 100%">
        <v-card class="topic-card elevation-3">
          <div class="top-part">
            <v-card-title primary-title class="title-with-btn">
              <div style="width: 75%">
                <v-text-field
                  class="headline"
                  height="45"
                  v-model="topic.title"
                  placeholder="题目标题"
                  :disabled="!isEditing"
                ></v-text-field>
              </div>
              <v-btn
                color="black"
                class="white--text"
                :disabled="topic.options.length === 0 && !isEditing"
                style="margin-bottom: 1rem"
                @click.stop="dialog.isOpen = true; openDialogType = 'options';"
              >
                {{ topic.options.length === 0
                ? (isEditing ? '添加选项' :'填空题')
                : (isEditing? '修改选项' : '查看选项') }}
              </v-btn>
            </v-card-title>
            <v-card-text
              class="grey--text topic-content"
              v-if="!isEditing"
              style="padding-top: 0"
              v-html="marked(topic.content)"
            >{{marked(topic.content)}}</v-card-text>
            <v-card-text v-else-if="isEditing" style="padding-top: 0">
              <v-textarea
                placeholder="题目内容"
                box
                v-model="topic.content"
                class="topic-content-edit-area"
              ></v-textarea>
            </v-card-text>
          </div>
          <div class="file-part">
            <v-card color="blue lighten-3" class="img-groups">
              <v-card-title style="padding: 0; padding-left: 1rem; height: 48px">
                <div class="title white--text">图片</div>
                <v-spacer/>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-if="isEditing" @click="$refs.image.click()" v-on="on">
                      <v-icon>add_photo_alternate</v-icon>
                    </v-btn>
                  </template>
                  <span>添加图片</span>
                </v-tooltip>
              </v-card-title>
              <v-carousel
                style="width: 100%; height: calc(100% - 48px)"
                hide-delimiters
                :cycle="false"
                v-if="topic.images.length !== 0"
                height="100%"
                :hide-controls="topic.images.length === 1"
              >
                <v-carousel-item
                  v-for="(img, index) in topic.images"
                  :key="index"
                  :src="baseURL + img.url"
                  :alt="img.name"
                  @click="newTab(baseURL + img.url)"
                  style="height: 100%; cursor: pointer"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        small
                        v-on="on"
                        v-if="isEditing"
                        @click.stop="
                          willDeleteIndex = index;
                          dialog.isOpen = true;
                          openDialogType = 'deleteImage'"
                      >
                        <v-icon>broken_image</v-icon>
                      </v-btn>
                    </template>
                    <span>删除图片</span>
                  </v-tooltip>
                </v-carousel-item>
              </v-carousel>
              <div class="no-file" v-else>
                <v-icon x-large style="margin-bottom: 1rem">link_off</v-icon>
                <span class="grey--text">这道题还没有图片哦，给它添加一张吧~</span>
              </div>
            </v-card>
            <v-card class="blue lighten-3 annex-groups">
              <v-card-title style="padding: 0; margin-left: 1rem; height: 48px">
                <div class="title white--text">附件</div>
                <v-spacer/>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-if="isEditing" @click="$refs.annex.click()" v-on="on">
                      <v-icon>note_add</v-icon>
                    </v-btn>
                  </template>
                  <span>添加附件</span>
                </v-tooltip>
              </v-card-title>
              <v-list
                style="overflow-y: auto; height: calc(100% - 48px)"
                v-if="topic.attachments.length !== 0"
                class="annex-show"
              >
                <v-list-tile
                  v-for="(annex, index) in topic.attachments"
                  :key="index"
                  @click="newTab(baseURL + annex.url)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title v-html="annex.name"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          fab
                          ripple
                          icon
                          style="width: 30px; height: 30px;"
                          v-if="isEditing"
                          v-on="on"
                          @click.stop="
                            dialog.isOpen = true;
                            willDeleteIndex = index;
                            openDialogType = 'deleteAnnex'"
                        >
                          <v-icon dark>clear</v-icon>
                        </v-btn>
                      </template>
                      <span>删除附件</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
              <div class="no-file" v-else>
                <v-icon x-large style="margin-bottom: 1rem">link_off</v-icon>
                <span class="grey--text">这道题还没有附件哦，给它添加一个吧~</span>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import {
  modifyQuestions, deleteQuestions, addSource, deleteSource, baseURL,
} from '@/api/index';
import DebounceConstructor from '@/utils/debounce.js';

export default {
  data() {
    // 使用了防抖函数，避免频繁输入时引起的卡顿，优化体验
    const {
      Debounce: handleTyping,
    } = DebounceConstructor((val) => {
      console.log(val);
      if (val) {
        if (val !== this.selectItem) {
          this.handleSearch(val);
        }
      }
    }, 400);

    return {
      isSnackBarShow: false,
      isSuccess: false,
      isSearchClick: false,
      isEditing: false,
      isGettingQuestions: false,
      isGetQuestionsSuccess: false,
      dialog: {
        type: ['checking', 'deleteImage', 'deleteAnnex', 'deleteTopic', 'options'],
        isOpen: false,
      },
      openDialogType: '',
      // 目前选中的题目的选项卡，也是选中的题目的索引
      activeTab: 0,
      // 即将删除的文件索引
      willDeleteIndex: -1,
      successMsg: '',
      errMsg: '',
      // 正在搜索
      isSearching: false,
      // 搜索到的内容，显示在下拉框
      searchItems: [],
      // 搜索框输入的内容
      searchContent: '',
      // 在下拉框中选择的项
      selectItem: '',
      baseURL,
      handleTyping,
    };
  },
  computed: {
    // 获取题目后的题目数组
    topicGroups() {
      return this.$store.state.questionArray;
    },
    // 储存题目标题以供搜索
    topicTitles() {
      return this.$store.state.questionArray.map(item => item.title);
    },
  },
  watch: {
    // 搜索内容改变则开始检索
    searchContent(val) {
      this.handleTyping(val);
    },
    // 点击搜索项后跳转到那道题
    selectItem(val) {
      const titleIndex = this.topicTitles.findIndex(title => val === title);
      if (titleIndex !== -1) {
        this.activeTab = titleIndex;
      }
    },
  },
  async mounted() {
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
    this.isGettingQuestions = true;
    await this.$store
      .dispatch('update')
      .then((res) => {
        this.isGettingQuestions = false;
        this.isGetQuestionsSuccess = true;
      })
      .catch((err) => {
        this.isGettingQuestions = false;
        this.isGetQuestionsSuccess = false;
      });
  },
  methods: {
    newTab(target) {
      window.open(target, '_blank');
    },
    async handleEditClick() {
      // 已经处于编辑状态则提交修改
      if (this.isEditing) {
        this.dialog.isOpen = true;
        this.openDialogType = 'checking';
        const {
          id, title, content, options,
        } = this.topicGroups[this.activeTab];
        await modifyQuestions(title, content, options, id)
          .then((res) => {
            this.$store.dispatch('update');
            this.isEditing = false;
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
            const { ret, desc } = res;
            if (ret === 200 && desc === 'successful') {
              this.isSuccess = true;
              this.successMsg = '修改成功！';
            } else {
              this.errMsg = '修改失败，服务异常！';
              this.isSuccess = false;
            }
          })
          .catch((err) => {
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
            this.isSuccess = false;
            this.errMsg = '修改失败，服务异常！';
          });
      } else {
        this.isEditing = !this.isEditing;
      }
    },
    handleSearch(searchContent) {
      this.isSearching = true;
      // 搜索的进度条，假装花了点时间
      setTimeout(() => {
        this.searchItems = this.topicTitles.filter(
          item => (item || '').indexOf(searchContent || '') > -1,
        );
        this.isSearching = false;
      }, 500);
    },
    addOption() {
      this.topicGroups[this.activeTab].options.push('');
    },
    removeOption(e) {
      const { id } = e.target;
      this.topicGroups[this.activeTab].options.splice(id, 1);
    },
    async handleDeleteTopic() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      const { id } = this.topicGroups[this.activeTab];
      await deleteQuestions(id)
        .then((res) => {
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.$store.dispatch('update');
            this.isSuccess = true;
            this.successMsg = '删除成功！';
          } else {
            this.isSuccess = false;
            this.errMsg = '删除失败，服务异常！';
          }
        })
        .catch((err) => {
          this.isSuccess = false;
          this.errMsg = '删除失败，服务异常！';
        })
        .finally(() => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
        });
    },
    async handleAddFile(e) {
      const { files, name } = e.target;
      if (files.length !== 0) {
        const file = files[0];
        const { id } = this.topicGroups[this.activeTab];
        this.dialog.isOpen = true;
        this.openDialogType = 'checking';
        const uploadFile = new FormData();
        uploadFile.append('problem_id', id);
        uploadFile.append('type', name);
        uploadFile.append('name', file.name);
        uploadFile.append('source', file);
        await addSource(uploadFile)
          .then((res) => {
            const { ret, desc } = res;
            if (ret === 200 && desc === 'successful') {
              this.$store.dispatch('update');
              this.isSuccess = true;
              this.successMsg = '添加成功！';
            } else {
              this.errMsg = '添加失败，服务异常！';
              this.isSuccess = false;
            }
          })
          .catch((err) => {
            this.isSuccess = false;
            this.errMsg = '添加失败，服务异常！';
          })
          .finally(() => {
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
          });
      }
    },
    async handleDeleteFile(type) {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      const { url } = type === 'annex'
        ? this.topicGroups[this.activeTab].attachments[this.willDeleteIndex]
        : this.topicGroups[this.activeTab].images[this.willDeleteIndex];
      await deleteSource(url)
        .then((res) => {
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.$store.dispatch('update');
            this.isSuccess = true;
            this.successMsg = '删除成功！';
          } else {
            this.isSuccess = false;
            this.errMsg = '删除失败，服务异常！';
          }
        })
        .catch((err) => {
          this.isSuccess = false;
          this.errMsg = '删除失败，服务异常！';
        }).finally(() => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.willDeleteIndex = -1;
        });
    },
    marked,
  },
};
</script>

<style lang="stylus">
.editTopic
  width 95%
  height 700px
  margin-top -1rem
  div
    background-size 100% 100%
  .topic
    height calc(100% - 112px)
    >div
      height 100%
    .topic-card
      display flex
      flex-direction column
      justify-content space-between
      padding 0 2rem 1rem
      height 100%
      .top-part
        display flex
        flex-direction column
        justify-content space-between
        height 48%
        .title-with-btn
          display flex
          justify-content space-between
          padding-bottom 0
        .topic-content-edit-area
          height 100%
          width 100%
          textarea
            height 150px
        .topic-content
          height 70%
          overflow-y auto
      .file-part
        display flex
        justify-content space-between
        width 100%
        height 45%
        .img-groups
          width 40%
          height 100%
          margin-left 1rem
        .annex-groups
          width 40%
          height 100%
          margin-right 1rem
          .annex-show div
            width 100%
.no-file
  background-color white
  display flex
  flex-direction column
  justify-content center
  align-items center
  height calc(100% - 48px)
</style>
