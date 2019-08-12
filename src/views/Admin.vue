<template>
  <div class="admin">
    <v-navigation-drawer
      clipped
      permanent
      style="width: 15vw; height: calc(100vh - 80px)"
      class="elevation-2"
    >
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
        <v-list-tile @click="changeStatus('addTopic')">
          <v-list-tile-action>
            <v-icon>add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="letter-spacing: 2px">题目添加</v-list-tile-title>
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
      <add-topic v-else-if="status === 'addTopic'"/>
      <edit-topic v-else-if="status === 'editTopic'"/>
    </div>
  </div>
</template>

<script>
import Announcement from '../components/Announcement';
import SetMatchTime from '../components/SetMatchTime';
import AddTopic from '../components/AddTopic';
import EditTopic from '../components/EditTopic';

export default {
  components: {
    Announcement,
    SetMatchTime,
    AddTopic,
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
  height calc(100vh - 80px)
  .detail
    padding 2rem
    padding-right 0
    width 85vw
    height calc(100vh - 80px)
    overflow-x hidden
    overflow-y auto
  .detail::-webkit-scrollbar
    width 0 !important
</style>
