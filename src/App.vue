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

export default {
  name: 'App',
  components: {
    ToolBar,
    Footer,
  },
};
</script>
