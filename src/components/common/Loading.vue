<template>
  <v-card class="loading-card" height="100%" width="100vw">
    <v-progress-circular size="80" color="primary" indeterminate style="margin-bottom: 2rem"/>
    <span class="grey--text">努力加载中......</span>
  </v-card>
</template>
<style lang="stylus">
.loading-card
  display flex
  flex-direction column
  justify-content center
  align-items center
</style>
