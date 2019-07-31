<template>
  <v-content class="login-container">
    <v-snackbar
      v-model="loginError"
      color="error"
      :right="true"
      :top="true"
      :timeout="3000"
    >登录失败，请检查学号或密码是否正确</v-snackbar>
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
                  label="学号"
                  :clearable="true"
                  v-model="studentID"
                  name="login"
                  prepend-icon="person"
                  type="text"
                ></v-text-field>
                <v-text-field
                  id="password"
                  v-model="password"
                  label="密码"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleLogin">登录</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  data: () => ({
    studentID: '',
    password: '',
    loginError: false,
  }),
  methods: {
    handleLogin() {
      /** 登录成功 => */
      /** 登录失败 => */ this.loginError = true;
    },
  },
};
</script>

<style lang="stylus">
.login-container
  height 88vh
</style>
