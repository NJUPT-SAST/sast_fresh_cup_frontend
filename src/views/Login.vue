<template>
  <div class="login-container">
    <v-snackbar
      v-model="loginError"
      color="error"
      :right="true"
      :top="true"
      :timeout="3000"
    >登录失败，请检查用户名/邮箱或密码是否正确</v-snackbar>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>登录</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="ATSAST账号,如:B19XXXXXX@njupt.edu.cn"
                  :clearable="true"
                  v-model="studentID"
                  name="login"
                  prepend-icon="person"
                  type="text"
                  autofocus
                ></v-text-field>
                <v-text-field
                  id="password"
                  v-model="password"
                  label="密码,默认学号如:B19xxxxxx"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleLogin" :loading="btnLoading">登录</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { login, userinfo } from '@/api/index';

export default {
  data: () => ({
    studentID: '',
    password: '',
    loginError: false,
    btnLoading: false,
  }),
  methods: {
    async handleLogin() {
      this.btnLoading = true;
      const { ret } = await login(this.studentID, this.password);
      if (ret === 200) {
        const {
          data: { is_admin: isAdmin, ...rest },
        } = await userinfo();
        this.$store.commit('handleUserinfo', {
          ...rest,
          isAdmin,
        });
        await this.$store.dispatch('init').then(() => {
          this.$store.commit('handleLoginStatus', true);
        });
        if (isAdmin) {
          this.$router.push({ name: 'admin' });
        } else {
          this.$router.push({ name: 'answer' });
        }
      } else {
        this.loginError = true;
      }
      this.btnLoading = false;
    },
  },
};
</script>

<style lang="stylus">
.login-container
  height calc(100vh - 80px - 36px)
</style>
