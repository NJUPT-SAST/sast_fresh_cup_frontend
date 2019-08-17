<template>
  <div style="z-index:9">
    <v-dialog v-model="logoutDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">确认登出？</v-card-title>
        <v-card-text>我们会保存您所有的操作。</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="logoutDialog = false">取消</v-btn>
          <v-btn color="error darken-1" flat @click="handleLoginStatus">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar color="primary" height="80">
      <v-toolbar-title class="toolBar-title" @click="jump('homepage')">计算机基础知识竞赛</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-badge color="error" overlap>
        <template v-if="noticeCount" v-slot:badge>{{noticeCount}}</template>
        <v-btn flat type="" @click="jump('notice')">
          <div class="toolBar-btn">公告</div>
        </v-btn>
      </v-badge>
      <v-btn flat @click="handleLoginStatus" v-if="!loginStatus">
        <div class="toolBar-btn">登录</div>
      </v-btn>
      <v-btn flat v-else @click.stop="logoutDialog = true">
        <div class="toolBar-btn">注销</div>
      </v-btn>
    </v-toolbar>
    <v-snackbar v-model="showSnackbar" :timeout="4000" bottom color="#0D47A1" style="bottom: 10px">
      <div @click="handleClickSnackbar" style="cursor: pointer">新公告</div>
      <v-btn flat dark text="" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import globalNotification from '../utils/globalNotification';

export default {
  name: 'ToolBar',
  data() {
    return {
      showSnackbar: false,
      logoutDialog: false,
      timer: null,
    };
  },
  computed: {
    noticeCount() {
      return this.$store.getters.unreadNoticeCount;
    },
    loginStatus() {
      return this.$store.state.loginStatus;
    },
  },
  watch: {
    loginStatus: {
      handler: 'handleInterval',
      immediate: true,
    },
  },
  methods: {
    jump(routerName) {
      this.$router.push({ name: routerName });
    },
    handleClickSnackbar() {
      this.showSnackbar = false;
      this.jump('notice');
    },
    async handleLoginStatus() {
      if (this.loginStatus) {
        this.logoutDialog = false;
        localStorage.removeItem('fresh_cup_token');
        this.$store.commit('handleLoginStatus', false);
        await this.$store.dispatch('reset').then(() => {
          this.jump('login');
        });
      } else {
        this.jump('login');
      }
    },
    handleInterval() {
      if (this.loginStatus) {
        this.timer = setInterval(() => {
          this.$store.dispatch('update');
        }, 10000);
      } else {
        // 登录状态为false时清理定时
        clearInterval(this.timer);
      }
    },
  },
  mounted() {
    if (!localStorage.getItem('fresh_cup_token')) {
      this.$router.push({ name: 'login' });
    }
  },
};
</script>

<style lang="stylus">
.toolBar-title
  color white
  margin-left 20px !important
  cursor pointer
  user-select none
.toolBar-btn
  color white
  user-select none
</style>
