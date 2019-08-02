<template>
  <v-content class="admin" style="padding: 0">
    <v-navigation-drawer clipped permanent app style="width: 250px">
      <v-list dense>
        <v-list-tile @click="changeStatus('announcement')">
          <v-list-tile-action>
            <v-icon>today</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="letter-spacing: 2px">公告发布</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="changeStatus('setMatchTime')">
          <v-list-tile-action>
            <v-icon>access_alarm</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="letter-spacing: 2px">比赛时间设置</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="changeStatus('editTopic')">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="letter-spacing: 2px">题目编辑</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>
    <div class="detail">
      <div v-if="status === ''">欢迎，点击左侧菜单进行操作</div>
      <announcement v-if="status === 'announcement'"/>
      <set-match-time v-else-if="status === 'setMatchTime'"/>
      <edit-topic v-else-if="status === 'editTopic'"/>
    </div>
  </v-content>
</template>

<script>
import Announcement from '../components/Announcement';
import SetMatchTime from '../components/SetMatchTime';
import EditTopic from '../components/EditTopic';

export default {
  components: {
    Announcement,
    SetMatchTime,
    EditTopic,
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
  margin-top 2rem
  width 65vw
  height 78vh
</style>
