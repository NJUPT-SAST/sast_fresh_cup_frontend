<template>
  <div class="cover" v-if="isCover"></div>
</template>
<style lang="stylus">
.cover
  width 100vw
  height 100vh
  position absolute
  background-color black
  z-index 999
  top 0px
  opacity 0.3
</style>
<script>
export default {
  name: 'OverLays',
  props: {
    isCover: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
