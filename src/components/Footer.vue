<template>
  <v-footer v-if="visible">
    <v-flex text-center>
      <P class="footer-text">
        2019 —
        <strong>@SAST</strong>
      </P>
    </v-flex>
  </v-footer>
</template>
<script>
export default {
  name: 'Footer',
  computed: {
    visible() {
      const routeName = this.$route.name;
      switch (routeName) {
      case 'answer':
        return false;
      case 'admin':
        return false;
      default:
        return true;
      }
    },
  },
};
</script>

<style lang="stylus">
.footer-text
  margin 0 auto
  text-align center
</style>
