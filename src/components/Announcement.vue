<template>
  <div class="announcement elevation-3">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSuccess? 'success' : 'error'"
      :right="true"
      :top="true"
      :timeout="3000"
    >{{isSuccess? successMsg : errMsg}}</v-snackbar>
    <v-dialog
      v-model="dialog.isOpen"
      persistent
      :max-width="openDialogType !== dialog.type[3]? '600px' : '300px'"
    >
      <v-card v-if="openDialogType === dialog.type[0]">
        <v-card-title>
          <v-icon style="margin-right: 1rem">edit</v-icon>
          <span class="headline">公告编辑</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap="">
              <v-flex xs12>
                <v-text-field
                  label="标题"
                  style="margin-bottom: 2rem"
                  v-model="noticeList[commandIndex].title"
                />
                <v-textarea label="内容" box v-model="noticeList[commandIndex].content"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success darken-1" flat @click="handleModify">确认修改</v-btn>
          <v-btn color="error darken-1" flat @click="openDialogType = 'delete'">删除</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog.isOpen = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="openDialogType === dialog.type[1]">
        <v-card-title>
          <v-icon style="margin-right: 1rem">add_comment</v-icon>
          <span class="headline">公告发布</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap="">
              <v-flex xs12>
                <v-text-field label="标题" style="margin-bottom: 2rem" v-model="addNotice.title"/>
                <v-textarea label="内容" box v-model="addNotice.content"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="dialog.isOpen = false">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="handleRelease">发布</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="openDialogType === dialog.type[2]">
        <v-card-title>
          <div class="headline">确认删除此条公告？</div>
          <span class="grey--text">此操作不可逆！</span>
        </v-card-title>
        <v-card-text class="title">{{ noticeList[commandIndex].title }}</v-card-text>
        <v-card-text class="grey--text">{{ noticeList[commandIndex].content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" flat @click="openDialogType = 'edit'">取消</v-btn>
          <v-btn color="green darken-1" flat @click="handleDelete">确认</v-btn>
        </v-card-actions>
      </v-card>
      <v-card color="primary" dark v-if="openDialogType === dialog.type[3]">
        <v-card-text>提交中...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-toolbar color="cyan" dark tabs height="64px">
      <v-icon>today</v-icon>
      <v-toolbar-title>公告板</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon @click.stop="dialog.isOpen = true; openDialogType = 'add'" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <span>点击添加</span>
      </v-tooltip>
    </v-toolbar>
    <v-card class="loading-card" v-if="isGettingNotice" height="calc(100% - 54px)">
      <v-progress-circular size="80" color="primary" indeterminate style="margin-bottom: 2rem"/>
      <span class="grey--text">努力加载中......</span>
    </v-card>
    <v-card
      class="loading-card"
      v-show="!isGetNoticeSuccess && !isGettingNotice"
      height="calc(100% - 54px)"
    >
      <v-icon x-large style="margin-bottom: 2rem" color="error">error</v-icon>
      <span class="grey--text">加载失败，请刷新页面重试！</span>
    </v-card>
    <v-card
      class="notice-container blue-grey lighten-4"
      v-show="isGetNoticeSuccess && !isGettingNotice"
    >
      <div class="notice-groups">
        <template v-for="(notice, index) in noticeList">
          <v-card
            class="notice-item elevation-3"
            :key="index"
            v-if="(index >= startIndex) && (index <= endIndex)"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-card-title class="notice-title" v-on="on">
                  <v-list dense class="cyan white--text">
                    <v-list-tile @click.stop="handleEditClick(index)" style="height: 52px">
                      <v-list-tile-content>
                        <v-list-tile-title class="title font-weight-light">{{ notice.title }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card-title>
              </template>
              <span>点击修改</span>
            </v-tooltip>
            <v-divider/>
            <v-card-text class="notice-content">{{ notice.content }}</v-card-text>
          </v-card>
        </template>
      </div>
      <div class="page-controller">
        <v-pagination
          v-model="nowPage"
          :length="pageNum"
          :total-visible="7"
          @input="handleNowPage"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import { modifyNotice, deleteNotice } from '../api/index';

export default {
  data: () => ({
    isSnackBarShow: false,
    isSuccess: false,
    isGettingNotice: false,
    isGetNoticeSuccess: false,
    dialog: {
      isOpen: false,
      type: ['edit', 'add', 'delete', 'checking'],
    },
    openDialogType: '',
    nowPage: 1,
    startIndex: 0,
    endIndex: 3,
    commandIndex: 0,
    addNotice: {
      title: '',
      content: '',
    },
    successMsg: '',
    errMsg: '',
  }),
  computed: {
    noticeList() {
      const noticeGroups = this.$store.state.noticeArray;
      const compare = p => (m, n) => {
        const a = m[p];
        const b = n[p];
        return b - a;
      };
      noticeGroups.sort(compare('time'));
      return noticeGroups;
    },
    pageNum() {
      return this.$store.state.noticeArray.length % 4 === 0
        ? parseInt(this.$store.state.noticeArray.length / 4)
        : parseInt(this.$store.state.noticeArray.length / 4 + 1);
    },
  },
  async mounted() {
    this.isGettingNotice = true;
    await this.$store
      .dispatch('update')
      .then((res) => {
        this.isGettingNotice = false;
        this.isGetNoticeSuccess = true;
      })
      .catch((err) => {
        this.isGettingNotice = false;
        this.isGetNoticeSuccess = false;
      });
  },
  methods: {
    handleNowPage() {
      this.startIndex = (this.nowPage - 1) * 4;
      this.endIndex = this.nowPage * 4 - 1;
    },
    handleEditClick(index) {
      this.commandIndex = index;
      this.dialog.isOpen = true;
      this.openDialogType = 'edit';
    },
    async handleRelease() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      const { title, content } = this.addNotice;
      await modifyNotice(title, content)
        .then((res) => {
          console.log(res);
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.isSuccess = true;
            this.successMsg = '发布成功！';
            this.$store.dispatch('update');
            this.addNotice = {
              title: '',
              content: '',
            };
          } else {
            this.errMsg = '发布失败，服务异常！';
            this.isSuccess = false;
          }
        })
        .catch((err) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.isSuccess = false;
          this.errMsg = '发布失败，服务异常！';
        });
    },
    async handleModify() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      const { id, title, content } = this.noticeList[this.commandIndex];
      await modifyNotice(title, content, id)
        .then((res) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.isSuccess = true;
            this.successMsg = '修改成功！';
            this.$store.dispatch('update');
          } else {
            this.isSuccess = false;
            this.errMsg = '修改失败，服务异常！';
          }
        })
        .catch((err) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.isSuccess = false;
          this.errMsg = '修改失败，服务异常！';
        });
    },
    async handleDelete() {
      this.dialog.isOpen = true;
      this.openDialogType = 'checking';
      const { id } = this.noticeList[this.commandIndex];
      await deleteNotice(id)
        .then((res) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          const { ret, desc } = res;
          if (ret === 200 && desc === 'successful') {
            this.isSuccess = true;
            this.successMsg = '删除成功';
            this.$store.dispatch('update');
          } else {
            this.isSuccess = false;
            this.errMsg = '删除失败，服务异常！';
          }
        })
        .catch((err) => {
          this.dialog.isOpen = false;
          this.isSnackBarShow = true;
          this.isSuccess = false;
          this.errMsg = '删除失败，服务异常！';
        });
    },
  },
};
</script>

<style lang="stylus">
.announcement
  width 90%
  height 600px
  // .loading-card
  // height calc(100% - 54px)
  .notice-container
    height calc(100% - 54px)
    padding 3rem
    display flex
    flex-direction column
    justify-content space-between
    .notice-groups
      height calc(100% - 3rem - 4rem)
      display flex
      flex-direction row
      justify-content space-around
      .notice-item
        width 20%
        height 100%
        // margin 0 2rem
        .notice-title
          height 52px
          padding 0
          .v-list
            width 100%
            height 100%
            padding 0
            .v-list__tile
              height 100%
          .title
            height 24px
            text-align center
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
        .notice-content
          height calc(100% - 36px - 16px)
          word-wrap break-word
          overflow-y auto
    .page-controller
      width 100%
      display flex
      justify-content center
</style>
