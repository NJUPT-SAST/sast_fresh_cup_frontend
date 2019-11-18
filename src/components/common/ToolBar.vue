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
      <v-badge v-if="loginStatus" color="error" overlap>
        <template v-if="noticeCount" v-slot:badge>{{noticeCount}}</template>
        <v-btn flat type="" @click="showNotice = true">
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
      <div @click="handleClickSnackbar" style="cursor: pointer">发现新公告</div>
      <v-btn flat dark text="" @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
    <notice :showNotice="showNotice" @hideNotice="showNotice = false" />
  </div>
</template>
<script>
import Notice from './Notice';
import globalNotification from '@/utils/globalNotification';

export default {
  name: 'ToolBar',
  components: {
    Notice,
  },
  data() {
    return {
      showSnackbar: false,
      logoutDialog: false,
      timer: null,
      showNotice: false,
    };
  },
  computed: {
    noticeCount() {
      return this.$store.getters.unreadNoticeCount;
    },
    loginStatus() {
      return this.$store.state.loginStatus;
    },
    isAdmin() {
      try {
        return this.$store.state.userinfo.isAdmin !== 0;
      } catch (e) {
        return false;
      }
    },
  },
  watch: {
    loginStatus: {
      handler: 'handleInterval',
      immediate: true,
    },
    noticeCount(newCount, oldCount) {
      // 排除清零引起的公告数变化 , 并且登录管理员账号时不发出通知弹窗
      if (newCount !== 0 && (newCount - oldCount > 0) && !this.isAdmin) {
        this.showSnackbar = true;
        globalNotification('新的公告', `您收到了${newCount - oldCount}条新公告`);
      }
    },
    $route(value) {
      if (localStorage.getItem('fresh_cup_token')) {
        const { name } = value;
        if (name === 'admin') {
          if (!this.isAdmin) {
            this.$router.push({ name: 'admin' });
          }
        } else if (name === 'answer') {
          if (this.isAdmin) {
            this.$router.push({ name: 'answer' });
          }
        } else {
          this.$router.push({ name: 'login' });
        }
      } else {
        this.$router.push({ name: 'login' });
      }
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
        }, 15000);
      } else {
        // 登录状态为false时清理定时
        clearInterval(this.timer);
      }
    },
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
