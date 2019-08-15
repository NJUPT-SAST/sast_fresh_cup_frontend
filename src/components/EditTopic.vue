<template>
  <div class="editTopic elevation-3">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >
      <template v-if="snackbarType === 'modify'">{{ isSuccess? "修改成功！" : "修改失败，服务异常！" }}</template>
      <template v-else-if="snackbarType === 'delete'">
        {{ isSuccess? "删除成功" : "删除失败，服务异常！" }}
      </template>
      <template v-else-if="snackbarType === 'add'">{{ isSuccess? "添加成功" : "添加失败，服务异常" }}</template>
      <template v-else-if="snackbarType === 'search'">未找到ID，请检查输入是否正确！</template>
    </v-snackbar>
    <v-dialog
      v-model="dialog.isOpen"
      scrollable
      persistent
      :width="openDialogType === dialog.type[1]? '50vw' : '300'"
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
                : 'https://contestease.wyzwb.com'+topicGroups[activeTab].images[willDeleteIndex].url"
            class="grey darken-4"
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="dialog.isOpen = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click="handleDeleteImage">确认</v-btn>
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
          <v-btn color="green darken-1" flat @click="handleDeleteAnnex">确认</v-btn>
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
        <v-card-text style="height: 300px;">
          <template v-for="(option, index) in topicGroups[activeTab].options">
            <v-text-field
              v-model="topicGroups[activeTab].options[index]"
              :key="index"
              :disabled="!isEditing"
              placeholder="选项"
            />
          </template>
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
      @change="handleAddImage"
      style="width: 0; height: 0; display: none"
    >
    <input
      type="file"
      ref="annex"
      name="annex"
      @change="handleAddAnnex"
      style="width: 0; height: 0; display: none"
    >
    <v-toolbar color="cyan" dark tabs height="64px">
      <v-btn icon @click="handleSearchClick">
        <v-icon>search</v-icon>
      </v-btn>
      <v-toolbar-title v-if="!isSearching">题目编辑</v-toolbar-title>
      <v-text-field
        v-else-if="isSearching"
        append-outer-icon="send"
        flat
        placeholder="题目ID"
        solo-inverted
        style="margin-top: 10px"
        @click:append-outer="handleSearch"
        v-model="searchContent"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon @click="handleEditClick">
        <v-icon>{{isEditing? 'check' : 'edit'}}</v-icon>
      </v-btn>
      <v-btn
        icon
        v-show="!isEditing"
        @click.stop="
          dialog.isOpen = true;
          willDeleteIndex = activeTab;
          openDialogType = 'deleteTopic'"
      >
        <v-icon>delete</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs v-model="activeTab" color="cyan" show-arrows grow>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab
            v-for="(topic, index) in topicGroups"
            :key="index"
            :disabled="isEditing"
          >{{ 'QUESTION' + topic.id }}</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-card class="loading-card" v-if="isGettingQuestions">
      <v-progress-circular size="80" color="primary" indeterminate style="margin-bottom: 2rem"/>
      <span class="grey--text">努力加载中......</span>
    </v-card>
    <v-tabs-items v-model="activeTab" class="topic" v-show="isGetQuestionsSuccess">
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
                dark
                style="margin-bottom: 1rem"
                @click.stop="dialog.isOpen = true; openDialogType = 'options';"
                v-if="topic.options.length"
              >{{isEditing? '修改选项' : '查看选项'}}</v-btn>
            </v-card-title>
            <v-card-text
              class="grey--text topic-content"
              v-if="!isEditing"
              style="padding-top: 0"
            >{{topic.content}}</v-card-text>
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
            <v-card color="cyan lighten-3" class="img-groups">
              <v-card-title style="padding: 0; padding-left: 1rem; height: 48px">
                <div class="title white--text">图片</div>
                <v-spacer/>
                <v-btn icon v-if="isEditing" @click="$refs.image.click()">
                  <v-icon>add_photo_alternate</v-icon>
                </v-btn>
              </v-card-title>
              <v-carousel
                style="width: 100%; height: calc(100% - 48px)"
                hide-delimiters
                :cycle="false"
                v-if="topic.images.length !== 0"
                height="100%"
              >
                <v-carousel-item
                  v-for="(img, index) in topic.images"
                  :key="index"
                  :src="'https://contestease.wyzwb.com'+img.url"
                  style="height: 100%"
                >
                  <v-btn
                    fab
                    small
                    v-if="isEditing"
                    @click.stop="
                    willDeleteIndex = index;
                    dialog.isOpen = true;
                    openDialogType = 'deleteImage'"
                  >
                    <v-icon>broken_image</v-icon>
                  </v-btn>
                </v-carousel-item>
              </v-carousel>
              <div class="no-file" v-else>
                <div class="display-1">无</div>
              </div>
            </v-card>
            <v-card class="cyan lighten-3 annex-groups">
              <v-card-title style="padding: 0; margin-left: 1rem; height: 48px">
                <div class="title white--text">附件</div>
                <v-spacer/>
                <v-btn icon v-if="isEditing" @click="$refs.annex.click()">
                  <v-icon>note_add</v-icon>
                </v-btn>
              </v-card-title>
              <v-list
                style="overflow-y: auto; height: calc(100% - 48px)"
                v-if="topic.attachments.length !== 0"
                class="annex-show"
              >
                <v-list-tile v-for="(annex, index) in topic.attachments" :key="index" @click.stop>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="annex.name"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn
                      fab
                      ripple
                      icon
                      style="width: 30px; height: 30px;"
                      v-if="isEditing"
                      @click.stop="
                        dialog.isOpen = true;
                        willDeleteIndex = index;
                        openDialogType = 'deleteAnnex'"
                    >
                      <v-icon dark>clear</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
              <div class="no-file" v-else>
                <div class="display-1">无</div>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import {
  modifyQuestions, deleteQuestions, addSource, deleteSource,
} from '../api/index';

export default {
  data: () => ({
    isSnackBarShow: false,
    isSuccess: false,
    isSearching: false,
    isEditing: false,
    isGettingQuestions: false,
    isGetQuestionsSuccess: false,
    dialog: {
      type: ['checking', 'deleteImage', 'deleteAnnex', 'deleteTopic', 'options'],
      isOpen: false,
    },
    openDialogType: '',
    snackbarType: '',
    // 目前选中的题目的选项卡，也是选中的题目的索引
    activeTab: null,
    // 搜索的内容
    searchContent: '',
    // 即将删除的文件索引
    willDeleteIndex: -1,
  }),
  computed: {
    // 获取题目后的题目数组
    topicGroups() {
      return this.$store.state.questionArray;
    },
  },
  async mounted() {
    this.isGettingQuestions = true;
    await this.$store.dispatch('update').then((res) => {
      this.isGettingQuestions = false;
      this.isGetQuestionsSuccess = true;
    });
  },
  methods: {
    async handleEditClick() {
      // 已经处于编辑状态则提交修改
      if (this.isEditing) {
        this.dialog.isOpen = true;
        this.openDialogType = 'checking';
        const {
          id, title, content, options,
        } = this.topicGroups[this.activeTab];
        await modifyQuestions(title, content, options, id).then((res) => {
          this.$store.dispatch('update');
          this.isEditing = false;
          this.dialog.isOpen = false;
          this.snackbarType = 'modify';
          this.isSnackBarShow = true;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
        });
      } else {
        this.isEditing = !this.isEditing;
      }
    },
    handleSearchClick() {
      this.isSearching = !this.isSearching;
    },
    handleSearch() {
      const searchIndex = this.topicGroups.findIndex(
        item => item.id === Number(this.searchContent),
      );
      if (searchIndex === -1) {
        this.isSnackBarShow = true;
        this.snackbarType = 'search';
        this.isSuccess = false;
      } else {
        this.activeTab = searchIndex;
        this.searchContent = '';
        this.isSearching = false;
      }
    },
    addOption() {
      this.topicGroups[this.activeTab].options.push('');
    },
    async handleDeleteTopic() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      this.snackbarType = 'delete';
      const { id } = this.topicGroups[this.activeTab];
      await deleteQuestions(id)
        .then((res) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.$store.dispatch('update');
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
        })
        .catch((err) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.isSuccess = false;
        });
    },
    async handleAddAnnex(e) {
      const { files } = e.target;
      if (files.length !== 0) {
        const file = files[0];
        const { id } = this.topicGroups[this.activeTab];
        this.dialog.isOpen = true;
        this.openDialogType = 'checking';
        this.snackbarType = 'add';
        const uploadFile = new FormData();
        uploadFile.append('problem_id', id);
        uploadFile.append('type', 'attachment');
        uploadFile.append('name', file.name);
        uploadFile.append('source', file);
        await addSource(uploadFile)
          .then((res) => {
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
            const { ret, desc } = res;
            if (ret === 200 && desc === 'successful') {
              this.$store.dispatch('update');
              this.isSuccess = true;
            } else {
              this.isSuccess = false;
            }
          })
          .catch((err) => {
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
            this.isSuccess = false;
          });
      }
    },
    async handleDeleteAnnex() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      this.snackbarType = 'delete';
      const { url } = this.topicGroups[this.activeTab].attachments[this.willDeleteIndex];
      await deleteSource(url)
        .then((res) => {
          this.dialog.isOpen = false;
          this.isSnackBaeShow = true;
          this.willDeleteIndex = -1;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.$store.dispatch('update');
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
        })
        .catch((err) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.isSuccess = false;
          this.willDeleteIndex = -1;
        });
    },
    async handleAddImage(e) {
      const { files } = e.target;
      if (files.length !== 0) {
        const { id } = this.topicGroups[this.activeTab];
        const file = files[0];
        this.dialog.isOpen = true;
        this.openDialogType = 'checking';
        this.snackbarType = 'add';
        const uploadFile = new FormData();
        uploadFile.append('problem_id', id);
        uploadFile.append('type', 'image');
        uploadFile.append('name', file.name);
        uploadFile.append('source', file);
        await addSource(uploadFile)
          .then((res) => {
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
            const { ret, desc } = res;
            if (ret === 200 && desc === 'successful') {
              this.$store.dispatch('update');
              this.isSuccess = true;
            } else {
              this.isSuccess = false;
            }
          })
          .catch((err) => {
            this.dialog.isOpen = false;
            this.isSnackBarShow = true;
            this.isSuccess = false;
          });
      }
    },
    async handleDeleteImage() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      this.snackbarType = 'delete';
      const { url } = this.topicGroups[this.activeTab].images[this.willDeleteIndex];
      await deleteSource(url)
        .then((res) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.willDeleteIndex = -1;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.$store.dispatch('update');
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
        })
        .catch((err) => {
          this.dialog.isOpen = false;
          this.isSnackShow = true;
          this.isSuccess = false;
          this.willDeleteIndex = -1;
        });
    },
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
  .loading-card
    display flex
    flex-direction column
    justify-content center
    align-items center
    height calc(100% - 112px)
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
          justify-content center
          align-items center
          height calc(100% - 48px)
</style>
