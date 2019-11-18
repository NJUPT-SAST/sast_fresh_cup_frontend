<template>
  <v-dialog
    fullscreen hide-overlay transition="dialog-bottom-transition"
    v-model="showNotice"
    class="notice"
  >
    <v-toolbar dark color="primary" fixed>
      <v-btn icon dark @click="handleClose">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>公告</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <div class="notice-container">
      <v-list class="notice-card" v-for="(notice,i) in notice" :key="i">
        <div>
        <img src="@/assets/NEW.png" alt="" v-if="!notice.checked">
        <v-card-title class="card_title">
          {{notice.title}}<span>{{moment(notice.time,'X').fromNow()}}</span>
        </v-card-title>
        <div class="link-top"></div>
        <v-card-text>{{notice.content}}</v-card-text>
        </div>
      </v-list>
    </div>
  </v-dialog>
</template>
<script>
import moment from 'moment';

moment.locale('zh-cn');

export default {
  data() {
    return {
      dialog: true,
    };
  },
  computed: {
    notice() {
      const { noticeArray, readNoticeArray } = this.$store.state;
      const readNoticeArrayId = readNoticeArray.map(item => item.id);
      const tempArray = Array.from(noticeArray);
      return tempArray.map((item) => {
        if (readNoticeArrayId.includes(item.id)) {
          return { ...item, checked: true };
        }
        return { ...item, checked: false };
      }).sort((a, b) => b.time - a.time);
    },
  },
  methods: {
    moment,
    handleClose() {
      this.$emit('hideNotice');
      this.$store.commit('handleReadNotice');
    },
  },
  props: {
    showNotice: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
<style scoped>
  .notice-container{
    padding:80px 0 80px 0;
    background-color: white;
    height: 100%;
  }
  .notice-card{
    max-width:800px;
    margin:20px auto;
    border-left:5px solid #1976d2;
    border-radius:10px;
    position:relative;
    box-shadow: 2px 2px 2px grey;
  }
  .link-top {
    width: 96%;
    height: 1px;
    border-top: dashed rgb(202, 206, 212) 1px;
    margin:0 auto;
      }
  .card_title{
    display:flex;
    justify-content: space-between;
    font-size:20px;
    text-indent:1em;
  }
  .notice-card img{
    width:50px;
    position:absolute;
    left:-5px;
  }
</style>
