<template>
  <v-app>
    <tool-bar />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import ToolBar from './components/ToolBar';
import Footer from './components/Footer';

import * as api from './api/index.js';

export default {
  name: 'App',
  components: {
    ToolBar,
    Footer,
  },
  async mounted() {
    window.api = api;
    window.store = this.$store;
    // 这两行代码是测试使用的
  },
};
</script>
