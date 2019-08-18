<template>
  <div>
    <v-progress-circular
      class="timer elevation-4"
      :color="color"
      :value="percentage*100"
      :size="75"
      :rotate="-90"
    >{{rest}}min</v-progress-circular>
  </div>
</template>
<script>
export default {
  name: 'Timer',
  computed: {
    percentage() {
      return this.rest / this.total;
    },
    color() {
      if (this.percentage < 0.3) return '#F44336';
      if (this.percentage < 0.6) return '#FDD835';
      if (this.percentage < 0.8) return 'green';
      return 'blue';
    },
  },
  props: {
    total: {
      type: Number,
      default: () => 60,
    },
    rest: {
      type: Number,
      default: () => 50,
    },
  },
};
</script>

<style lang="stylus">
.timer
  z-index 4
  background-color white
  cursor pointer
  border-radius 50%
  transition all 0.3s
.timer:hover
  transform scale(1.9) translate(-20px,-20px)
</style>
