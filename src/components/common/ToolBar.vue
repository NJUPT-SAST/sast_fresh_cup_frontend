<template>
  <div style="z-index:9">
    <v-toolbar color="primary" height="80">
      <v-toolbar-title class="toolBar-title" @click="jump('homepage')">
        计算机基础知识竞赛
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-badge color="error" overlap>
        <template v-if="noticeCount" v-slot:badge>{{noticeCount}}</template>
        <v-btn flat type @click="jump('notice')">
          <div class="toolBar-btn" >公告</div>
        </v-btn>
      </v-badge>
      <v-btn flat @click="jump('login')">
        <div class="toolBar-btn">登录</div>
      </v-btn>
    </v-toolbar>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="4000"
      bottom=""
      color="#0D47A1"
      style="bottom: 10px"
    >
      <div @click="handleClickSnackbar" style="cursor: pointer">
        新公告
      </div>
      <v-btn
        flat
        dark
        text
        @click="showSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import globalNotification from '@/utils/globalNotification';

export default {
  name: 'ToolBar',
  data() {
    return {
      showSnackbar: false,
    };
  },
  computed: {
    noticeCount() {
      return this.$store.getters.unreadNoticeCount;
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
  },
  async mounted() {
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
  cursor: pointer
  user-select none
.toolBar-btn
  color white
  user-select none
</style>
