<template>
  <v-card class="matchTime">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSetSuccess? 'success' : 'error'"
      :right="true"
      :top="true"
      :timeout="3000"
    >{{isSetSuccess? "设置成功！" : "设置失败，服务异常！"}}</v-snackbar>
    <v-btn
      fab
      dark
      color="success"
      fixed
      bottom
      right
      @click="handleSetting"
      :loading="isSetting"
      :disable="isSetting"
    >
      <v-icon dark>check</v-icon>
    </v-btn>
    <div class="headline">比赛时间设置</div>
    <div class="ready-time">预设结束时间：{{endTime}}</div>
    <div class="time-picker-groups">
      <v-time-picker v-model="endTime" full-width landscape format="24hr"></v-time-picker>
    </div>
    <div class="helper font-weight-thin font-italic">（↑ 点击上方的数字分别设置时、分 ↑）</div>
    <div class="btn-groups">
      <v-btn color="grey lighten-1" @click="handleReset">重置
        <v-icon right dark>reply</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    isSnackBarShow: false,
    isSetting: false,
    isSetSuccess: false,
    startModal: false,
    endModal: false,
    startTime: null,
    endTime: null,
  }),
  methods: {
    handleSetting() {
      /**
       * 设置成功 => (效果)
       * isSetSuccess后面换成后端返回的结果
       * */
      this.isSetting = true;
      setTimeout(() => {
        this.isSetting = false;
        this.isSnackBarShow = true;
        this.isSetSuccess = false; // true
        this.startTime = null;
        this.endTime = null;
      }, 3000);
    },
    handleReset() {
      this.endTime = null;
    },
  },
};
</script>

<style lang="stylus">
.matchTime
  padding 3rem
  height auto
  .headline
    margin-bottom 2rem
  .ready-time
    text-align center
    font-size 1.2rem
    color #039BE5
    margin-bottom 1.5rem
  .time-picker-groups
    width 100%
    margin-bottom 2rem
  .btn-groups
    display flex
    justify-content flex-end
</style>
