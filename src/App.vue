<template>
  <v-app>
    <tool-bar />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import ToolBar from './components/ToolBar';

export default {
  name: 'App',
  components: {
    ToolBar,
  },
  data() {
    return {

    };
  },
};
</script>
