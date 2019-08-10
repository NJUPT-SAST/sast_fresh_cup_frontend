<template>
  <v-card class="announcement">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isReleaseSuccess? 'success' : 'error'"
      :right="true"
      :top="true"
      :timeout="3000"
    >{{isReleaseSuccess? "发布成功！" : "发布失败，服务异常！"}}</v-snackbar>
    <v-btn
      fab
      dark
      color="success"
      fixed
      bottom
      right
      @click="handleRelease"
      :loading="isReleasing"
      :disable="isReleasing"
    >
      <v-icon dark>check</v-icon>
    </v-btn>
    <div class="headline">公告编辑</div>
    <v-text-field
      v-model="bulletinTitle"
      outline
      label="标题"
      prepend-inner-icon="title"
      clearable
      style="width: 50%"
    />
    <v-textarea
      v-model="bulletinContent"
      prepend-inner-icon="text_fields"
      auto-grow
      outline
      label="内容"
      clearable
      style="width: 80%"
      height="40vh"
    />
  </v-card>
</template>

<script>
export default {
  data: () => ({
    bulletinTitle: '',
    bulletinContent: '',
    isSnackBarShow: false,
    isReleasing: false,
    isReleaseSuccess: false,
  }),
  methods: {
    handleRelease() {
      /**
       * 发布成功 => (效果)
       * isReleaseSuccess后面换成后端返回的结果
       * */
      this.isReleasing = true;
      setTimeout(() => {
        this.isReleasing = false;
        this.isSnackBarShow = true;
        this.isReleaseSuccess = false; // true
        this.bulletinTitle = '';
        this.bulletinContent = '';
      }, 3000);
    },
  },
};
</script>

<style lang="stylus">
.announcement
  padding 3rem
  width 100%
  height 90%
  .headline
    margin-bottom 2rem
  .btn-groups
    display flex
    justify-content flex-end
    width 100%
</style>
