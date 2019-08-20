<template>
  <v-card class="loading-card" height="100%" width="100vw">
      <v-icon x-large style="margin-bottom: 2rem" color="error">error</v-icon>
      <span class="grey--text">加载失败，请刷新页面重试！</span>
    </v-card>
</template>
<style lang="stylus">
.loading-card
  display flex
  flex-direction column
  justify-content center
  align-items center
</style>
