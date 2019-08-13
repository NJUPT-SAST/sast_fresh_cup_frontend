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
    <div class="time-picker-groups">
      <v-dialog
        ref="dialog1"
        v-model="startModal"
        :return-value.sync="startTime"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="startTime"
            label="比赛开始时间"
            prepend-icon="access_time"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="startModal" v-model="startTime" format="24hr" full-width>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="startModal = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog1.save(startTime)">确认</v-btn>
        </v-time-picker>
      </v-dialog>
      <v-dialog
        ref="dialog2"
        v-model="endModal"
        :return-value.sync="endTime"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="endTime"
            label="比赛结束时间"
            prepend-icon="access_time"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="endModal" v-model="endTime" format="24hr" full-width>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="endModal = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog2.save(endTime)">确认</v-btn>
        </v-time-picker>
      </v-dialog>
    </div>
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
      this.startTime = null;
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
  .time-picker-groups
    width 50%
    margin-bottom 2rem
  .btn-groups
    display flex
    justify-content flex-end
</style>
