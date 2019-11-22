<template>
  <div class="admin-container">
    <loading v-if="isIniting" />
    <load-error v-show="!isInitSuccess && !isIniting" />
    <div v-show="isInitSuccess && !isIniting" class="admin">
      <v-navigation-drawer
        clipped
        permanent
        style="width: 15vw; height: calc(100vh - 80px)"
        class="elevation-2"
      >
        <v-list dense>
          <div
            v-for="(navigationItem,index) in navigationItems"
            :key="index"
          >
            <v-list-tile @click="changeComponent(navigationItem.component)">
              <v-list-tile-action>
                <v-icon>{{navigationItem.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title style="letter-spacing: 2px">
                  {{navigationItem.name}}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-navigation-drawer>
      <div class="detail">
        <keep-alive>
          <component :is="activeComponent" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Announcement from '@/components/admin/Announcement';
import SetMatchTime from '@/components/admin/SetMatchTime';
import AddTopic from '@/components/admin/AddTopic';
import EditTopic from '@/components/admin/EditTopic';
import Loading from '@/components/common/Loading';
import LoadError from '@/components/common/LoadError';
import AdminWelcome from '@/components/admin/AdminWelcome';
import { deleteQuestions, deleteNotice } from '@/api/index.js';


export default {
  components: {
    Announcement,
    SetMatchTime,
    AddTopic,
    EditTopic,
    Loading,
    LoadError,
    AdminWelcome,
  },
  data: () => ({
    isIniting: false,
    isInitSuccess: false,
    activeComponent: AdminWelcome,
    navigationItems: [
      {
        name: '公告板',
        icon: 'today',
        component: Announcement,
      },
      {
        name: '比赛结束时间设置',
        icon: 'access_alarm',
        component: SetMatchTime,
      },
      {
        name: '题目添加',
        icon: 'add_circle_outline',
        component: AddTopic,
      },
      {
        name: '题目编辑',
        icon: 'edit',
        component: EditTopic,
      },
    ],
  }),
  methods: {
    changeComponent(newComponent) {
      this.activeComponent = newComponent;
    },
  },
  async mounted() {
    const store = this.$store;
    async function deleteWarpper(confirmText, rightAnswer, targets, action) {
      const answer = prompt(confirmText, 'no');
      if (answer === rightAnswer) {
        console.log('删除中...');
        try {
          await Promise.all(targets.map(x => action(x)));
          console.log('删除完成');
        } catch (e) {
          console.log(e);
          console.log('遇到了点错误');
        }
      } else {
        alert('拒绝');
      }
    }
    window.hiddenAction = {
      async deleteAllQuestion() {
        const ids = store.state.questionArray.map(x => x.id);
        deleteWarpper('确认删除所有问题吗?确认请输入yes', 'yes', ids, deleteQuestions);
      },
      async deleteAllNotice() {
        const ids = store.state.noticeArray.map(x => x.id);
        deleteWarpper('确认删除所有公告吗?确认请输入yes', 'yes', ids, deleteNotice);
      },
    };
    if (this.$store.state.userinfo.isAdmin) {
      this.isIniting = true;
      await this.$store
        .dispatch('init')
        .then(() => {
          this.isInitSuccess = true;
        })
        .catch(() => {
          this.isInitSuccess = false;
        })
        .finally(() => {
          this.isIniting = false;
        });
    } else {
      this.$router.go(-1);
    }
  },
};
</script>

<style lang="stylus">
.admin-container
  height calc(100vh - 80px)
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
