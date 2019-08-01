<template>
  <div class="announcement" style="padding: 0">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isReleaseSuccess? 'success' : 'error'"
      :right="true"
      :top="true"
      :timeout="3000"
    >{{isReleaseSuccess? "发布成功！" : "发布失败，服务异常！"}}</v-snackbar>
    <div class="headline">公告发布</div>
    <v-text-field outline label="标题" prepend-inner-icon="title" clearable/>
    <v-textarea prepend-inner-icon="text_fields" auto-grow outline label="内容" clearable/>
    <div class="btn-groups">
      <v-btn
        color="success"
        @click="handleRelease"
        :loading="isReleasing"
        :disable="isReleasing"
      >发布</v-btn>
    </div>
  </div>
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
      }, 3000);
    },
  },
};
</script>

<style lang="stylus">
.announcement
  margin-left 1.2rem
  .headline
    margin-bottom 1rem
  .btn-groups
    display flex
    justify-content flex-end
    width 100%
</style>
