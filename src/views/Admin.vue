<template>
  <div class="admin">
    <v-navigation-drawer clipped permanent style="width: 250px; height: calc(100vh - 80px)">
      <v-list dense>
        <v-list-tile @click="changeStatus('announcement')">
          <v-list-tile-action>
            <v-icon>today</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="letter-spacing: 2px">公告编辑</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="changeStatus('setMatchTime')">
          <v-list-tile-action>
            <v-icon>access_alarm</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="letter-spacing: 2px">比赛结束时间设置</v-list-tile-title>
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
      <template v-if="status === ''">欢迎，点击左侧菜单进行操作</template>
      <announcement v-if="status === 'announcement'"/>
      <set-match-time v-else-if="status === 'setMatchTime'"/>
      <edit-topic v-else-if="status === 'editTopic'"/>
    </div>
  </div>
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
.admin
  display flex
  .detail
    margin-top 2rem
    margin-left 2rem
    width calc(90vw - 250px)
    height 82vh
</style>
