<template>
  <div class="homepage-container">
    <v-card width="500" class="mx-auto">
      <v-card-title class="card_title">致2020年新生：</v-card-title>
      <v-card-text>欢迎参加南京邮电大学校科协新柚杯
        <br>点击确定报名参加本次比赛
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <router-link to="Login">
          <v-btn color="primary">确认</v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  mounted() {
    if (localStorage.getItem('fresh_cup_token')) {
      const { isAdmin } = this.$store.state.userinfo;
      if (isAdmin) {
        this.$router.push({ name: 'admin' });
      } else {
        this.$router.push({ name: 'answer' });
      }
    }
  },
};
</script>

<style scoped>
.homepage-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px - 36px)
}
.mx-auto {
  margin: 150px auto;
  box-shadow: 0 0 8px rgb(131, 132, 133);
}
.card_title {
  background-color: #1976d2;
  color: #fff;
  font-size: 20px;
}
.v-card__text {
  padding: 20px;
  line-height: 35px;
  font-size: 18px;
}
</style>
