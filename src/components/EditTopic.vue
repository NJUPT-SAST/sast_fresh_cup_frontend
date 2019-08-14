<template>
  <div class="editTopic elevation-3">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSubmitSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >{{isSubmitSuccess? "修改成功！" : "修改失败，服务异常！"}}</v-snackbar>
    <v-dialog
      v-model="dialog.isOpen"
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
            :src="willDeleteIndex === -1? '' : imageGroups[willDeleteIndex].src"
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
        <v-card-text>{{ willDeleteIndex === -1? '' : annexGroups[willDeleteIndex].name }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="dialog.isOpen = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click="handleDeleteAnnex">确认</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="openDialogType === dialog.type[3]">
        <v-card-title class="headline">确认删除此题？</v-card-title>
        <v-card-text class="grey--text">此操作不可逆！</v-card-text>
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
          <template v-for="(option, index) in topicGroupsCopy[activeTab].options">
            <v-text-field
              v-model="topicGroupsCopy[activeTab].options[index]"
              :key="index"
              :disabled="!isEditing"
              placeholder="选项"
            />
          </template>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
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
        flat
        placeholder="题目ID或标题"
        solo-inverted
        style="margin-top: 10px"
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
            v-for="(topic, index) in topicGroupsCopy"
            :key="index"
            :disabled="isEditing"
          >{{ 'QUESTION' + topic.qid }}</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="activeTab" class="topic">
      <v-tab-item v-for="(topic, index) in topicGroupsCopy" :key="index" style="height: 100%">
        <v-card class="topic-card elevation-3">
          <div class="top-part">
            <v-card-title primary-title class="title-with-btn">
              <div style="width: 70%">
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
                @click.stop="handleOptionClick"
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
                v-if="imageGroups.length !== 0"
                height="100%"
              >
                <v-carousel-item
                  v-for="(img, index) in imageGroups"
                  :key="index"
                  :src="img.src"
                  style="height: 100%"
                >
                  <v-btn
                    dark
                    icon
                    v-if="isEditing"
                    @click.stop="
                      dialog.isOpen = true;
                      willDeleteIndex = index;
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
                v-if="annexGroups.length !== 0"
                class="annex-show"
              >
                <v-list-tile v-for="(annex, index) in annexGroups" :key="index" @click.stop>
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
export default {
  data: () => ({
    isSnackBarShow: false,
    isSubmitSuccess: false,
    isSubmiting: false,
    isSearching: false,
    isEditing: false,
    dialog: {
      type: ['checking', 'deleteImage', 'deleteAnnex', 'deleteTopic', 'options'],
      isOpen: false,
    },
    openDialogType: '',
    // 题干是否变化
    isContentChange: false,
    // 图片或附件是否变化
    isFileChange: false,
    activeTab: null,
    // 题目数组的拷贝，在获取题目时赋值，用于对比是否变化以调用不同接口,显示在页面上的是这个数组的内容
    topicGroupsCopy: [
      {
        qid: 1,
        title: '题目一标题',
        content:
          '题目一内容，他很长很长很长很长很长很长很长很长很长很，长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        options: ['A', 'B', 'C', 'D'],
        image: [],
        annex: [],
      },
      {
        qid: 2,
        title: '题目二标题',
        content: '题目二内容',
        options: ['A', 'B', 'C', 'D'],
        image: [],
        annex: [],
      },
      {
        qid: 3,
        title: '题目三标题',
        content: '题目三内容',
        options: ['A', 'B', 'C', 'D'],
        image: [],
        annex: [],
      },
    ],
    // 获取题目后的题目数组
    topicGroups: [],
    // 暂用，后面直接用题目的图片数组
    imageGroups: [
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
      },
    ],
    // 同上
    annexGroups: [
      { name: '文件一' },
      { name: '文件二' },
      { name: '文件三' },
      { name: '文件四' },
      { name: '文件五' },
      { name: '文件六' },
    ],
    // 搜索的内容
    searchContent: '',
    // 即将删除的文件索引
    willDeleteIndex: -1,
  }),
  methods: {
    handleEditClick() {
      // 已经处于编辑状态时判断有无修改调用接口
      if (this.isEditing) {
        // 若有修改则调用接口，开启checkingDialog
        this.dialog.isOpen = true;
        this.openDialogType = 'checking';
        setTimeout(() => {
          this.dialog.isOpen = false;
          this.isEditing = !this.isEditing;
        }, 3000);
      } else {
        this.isEditing = !this.isEditing;
      }
    },
    handleSearchClick() {
      this.isSearching = !this.isSearching;
    },
    handleOptionClick() {
      this.dialog.isOpen = true;
      this.openDialogType = 'options';
      console.log(this.topicGroupsCopy[this.activeTab]);
    },
    handleDeleteTopic() {
      this.dialog.isOpen = false;
      // 调用删除接口，确认完成后再关闭checkingDialog
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      setTimeout(() => {
        this.dialog.isOpen = false;
      }, 3000);
    },
    handleAddAnnex(e) {
      const { files } = e.target;
      if (files.length !== 0) {
        const file = files[0];
        this.annexGroups.push({ name: file.name });
        this.isFileChange = true;
      }
    },
    handleDeleteAnnex() {
      this.annexGroups.splice(this.willDeleteIndex, 1);
      this.isFileChange = true;
      this.dialog.isOpen = false;
      this.willDeleteIndex = -1;
    },
    handleAddImage(e) {
      const { files } = e.target;
      // 添加后在轮播图实现预览
      if (files.length !== 0) {
        const file = files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (ev) => {
          const src = ev.target.result;
          const newImage = { src };
          this.imageGroups.push(newImage);
        };
        this.isFileChange = true;
      }
    },
    handleDeleteImage() {
      this.imageGroups.splice(this.willDeleteIndex, 1);
      this.isFileChange = true;
      this.dialog.isOpen = false;
      // 重置
      this.willDeleteIndex = -1;
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
            height 20vh
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
