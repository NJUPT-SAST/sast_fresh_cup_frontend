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
import { hash } from '../api/index';

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
    const hashResponse = await hash();
    this.$store.dispatch('update', hashResponse.data);
    setInterval(async () => {
      const { hash: oldHash } = this.$store.state;
      const { data: newHash } = await hash();
      if (oldHash !== newHash) {
        await this.$store.dispatch('update', newHash);
        this.showSnackbar = true;
      }
    }, 60000); // 目前是一分钟轮询一次
  },
  watch: {
    // 对于清除公告角标应放置在ToolBar还是Notice，这个后面再看一下
    $route(val) {
      if (val.name === 'notice') {
        this.$store.commit('handleReadNotice');
      }
    },
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
