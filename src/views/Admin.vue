<template>
  <div class="admin-container">
    <v-card class="loading-card" v-if="isIniting" height="100%" width="100vw">
      <v-progress-circular size="80" color="primary" indeterminate style="margin-bottom: 2rem"/>
      <span class="grey--text">努力加载中......</span>
    </v-card>
    <v-card class="loading-card" v-show="!isInitSuccess && !isIniting" height="100%" width="100vw">
      <v-icon x-large style="margin-bottom: 2rem" color="error">error</v-icon>
      <span class="grey--text">加载失败，请刷新页面重试！</span>
    </v-card>
    <div v-show="isInitSuccess && !isIniting" class="admin">
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
              <v-list-tile-title style="letter-spacing: 2px">公告板</v-list-tile-title>
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
    isIniting: false,
    isInitSuccess: false,
  }),
  methods: {
    changeStatus(status) {
      this.status = status;
    },
  },
  async mounted() {
    this.isIniting = true;
    await this.$store
      .dispatch('init')
      .then((res) => {
        this.isIniting = false;
        this.isInitSuccess = true;
      })
      .catch((err) => {
        this.isIniting = false;
        this.isInitSuccess = false;
      });
  },
};
</script>

<style lang="stylus">
.admin-container
  height calc(100vh - 80px)
  .loading-card
    display flex
    flex-direction column
    justify-content center
    align-items center
  .admin
    height 100%
    display flex
    .detail
      display flex
      justify-content center
      align-items center
      flex-wrap wrap
      width 85vw
      height calc(100vh - 80px)
      padding 2rem 0
      overflow-x hidden
      overflow-y auto
    .detail::-webkit-scrollbar
      width 0 !important
</style>
