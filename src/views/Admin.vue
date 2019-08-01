<template>
  <v-content class="admin" style="padding: 0">
    <v-navigation-drawer clipped fixed app permanent class="navigation-drawer">
      <v-list dense>
        <v-list-tile @click="changeStatus('announcement')">
          <v-list-tile-action>
            <v-icon>today</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>公告发布</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="changeStatus('setMatchTime')">
          <v-list-tile-action>
            <v-icon>access_alarm</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>比赛时间设置</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="changeStatus('editExam')">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>题目编辑</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content style="padding: 0">
      <v-container class="detail">
        <v-layout column justify-start>
          <v-flex>
            <template v-if="status === 'announcement'"><Announcement /></template>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-content>
</template>

<script>
import Announcement from '../components/Announcement';

export default {
  components: {
    Announcement,
  },
  data: () => ({
    status: '',
  }),
  methods: {
    changeStatus(status) {
      this.status = status;
    },
  },
};
</script>

<style lang="stylus">
.detail
  margin 0
  width 60vw
</style>
