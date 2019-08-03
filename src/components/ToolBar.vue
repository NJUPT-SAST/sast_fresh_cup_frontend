<template>
<<<<<<< HEAD
  <v-toolbar color="primary" height="80">
    <v-toolbar-title class="toolBar-title" @click="jump('homepage')">
      计算机基础知识竞赛
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn :flat="true">
      <div class="toolBar-btn" @click="jump('notice')">比赛须知</div>
    </v-btn>
    <v-btn :flat="true" @click="jump('login')">
      <div class="toolBar-btn">登录</div>
    </v-btn>
  </v-toolbar>
=======
  <div>
    <v-toolbar color="primary" height="80" app clipped-left>
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
>>>>>>> fdd4b388a50a57f58851a80411983f59d2932af9
</template>
<script>
export default {
  name: 'ToolBar',
  data() {
    return {
      showSnackbar: false,
    };
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount;
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
  mounted() {
    this.$store.commit('handleNoticeCount', 1); // 到时候替换成对公告接口的轮询，将值与noticeCount对比，有变动再调用commit
    this.showSnackbar = true;
  },
  watch: {
    // 对于清除公告角标应放置在ToolBar还是Notice，这个后面再看一下
    $route(val) {
      if (val.name === 'notice') {
        this.$store.commit('handleNoticeCount', 0);
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
.toolBar-btn
  color white
</style>
