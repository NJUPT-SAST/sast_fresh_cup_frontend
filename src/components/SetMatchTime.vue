<template>
  <v-card class="matchTime elevation-3">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSetSuccess? 'success' : 'error'"
      :right="true"
      :top="true"
      :timeout="3000"
    >{{isSetSuccess? "设置成功！" : errMsg}}</v-snackbar>
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
    <v-text-field
      class="match-name"
      v-model="matchName"
      label="比赛名称"
      prepend-icon="title"
      style="width: 50%"
    />
    <div class="time-picker-groups">
      <v-dialog
        ref="dialog1"
        v-model="dateModal"
        :return-value.sync="matchDate"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="matchDate" label="比赛日期" prepend-icon="event" readonly v-on="on"/>
        </template>
        <v-date-picker v-model="matchDate" scrollable color="primary">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dateModal = false">Cancle</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog1.save(matchDate)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
      <v-dialog
        ref="dialog2"
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
          <v-btn flat color="primary" @click="$refs.dialog2.save(startTime)">确认</v-btn>
        </v-time-picker>
      </v-dialog>
      <v-dialog
        ref="dialog3"
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
          <v-btn flat color="primary" @click="$refs.dialog3.save(endTime)">确认</v-btn>
        </v-time-picker>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import { modifyDue } from '../api/index';

export default {
  data: () => ({
    isSnackBarShow: false,
    isSetting: false,
    isSetSuccess: false,
    dateModal: false,
    startModal: false,
    endModal: false,
    startTime: '',
    endTime: '',
    matchDate: '',
    matchName: '',
    errMsg: '',
  }),
  mounted() {
    const startTimeStamp = this.$store.state.due.start;
    const endTimeStamp = this.$store.state.due.end;
    const startDate = new Date(startTimeStamp * 1000);
    const endDate = new Date(endTimeStamp * 1000);

    this.matchName = this.$store.state.name;

    this.matchDate = `${startDate.getFullYear()}-${
      startDate.getMonth() + 1 < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1
    }-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`;

    this.startTime = `${
      startDate.getHours() < 10 ? `0${startDate.getHours()}` : startDate.getHours()
    }:${startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()}`;

    this.endTime = `${endDate.getHours() < 10 ? `0${endDate.getHours()}` : endDate.getHours()}:${
      endDate.getMinutes() < 10 ? `0${endDate.getMinutes()}` : endDate.getMinutes()
    }`;
  },
  methods: {
    async handleSetting() {
      const startStr = `${this.matchDate} ${this.startTime}`;
      const endStr = `${this.matchDate} ${this.endTime}`;
      const startTimeStamp = Date.parse(new Date(startStr.replace(/-/g, '/'))) / 1000;
      const endTimeStamp = Date.parse(new Date(endStr.replace(/-/g, '/'))) / 1000;
      if (startTimeStamp < endTimeStamp) {
        this.isSetting = true;
        await modifyDue({ start: startTimeStamp, end: endTimeStamp, name: this.matchName })
          .then((res) => {
            this.isSetting = false;
            this.isSnackBarShow = true;
            const { ret, desc } = res;
            if (ret === 200 && desc === 'successful') {
              this.$store.dispatch('update');
              this.isSetSuccess = true;
            } else {
              this.errMsg = '设置失败，服务异常！';
              this.isSetSuccess = false;
            }
          })
          .catch((err) => {
            this.isSetting = false;
            this.isSnackBarShow = true;
            this.isSetSuccess = false;
            this.errMsg = '设置失败，服务异常！';
          });
      } else {
        this.isSnackBarShow = true;
        this.isSetSuccess = false;
        this.errMsg = '起始时间不可大于/等于结束时间！';
      }
    },
  },
};
</script>

<style lang="stylus">
.matchTime
  padding 3rem
  width 70%
  height 470px
  .headline
    margin-bottom 2rem
  .time-picker-groups
    width 50%
    margin-bottom 2rem
  .btn-groups
    display flex
    justify-content flex-end
</style>
