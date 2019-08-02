<template>
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
</template>
<script>
export default {
  name: 'ToolBar',
  methods: {
    jump(routerName) {
      this.$router.push({ name: routerName });
    },
  },
};
</script>

<style lang="stylus">
.toolBar-title
  color white
  margin-left 20px !important
.toolBar-btn
  color white
</style>
