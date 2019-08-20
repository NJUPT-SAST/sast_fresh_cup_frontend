<template>
  <div class="fab-group">
    <timer
      :total="total"
      :rest="rest"
    />
    <v-btn
      fab
      large
      color="green"
      style="color:white"
      :disabled="isUpDisabled"
      @click="$emit('handleUp')"
    >
      <v-icon>arrow_upward</v-icon>
    </v-btn>
    <v-btn
      fab
      large
      color="green"
      style="color:white"
      :disabled="isDownDisabled"
      @click="$emit('handleDown')"
    >
      <v-icon>arrow_downward</v-icon>
    </v-btn>
    <v-btn
      fab
      large
      color="green"
      style="color:white"
      @click="$emit('handleDone')"
    >
      <v-icon>done</v-icon>
    </v-btn>
  </div>
</template>
<style lang="stylus">
.fab-group
  display flex
  flex-direction column
  position fixed
  bottom 30px
  right 10px
  z-index 99
  align-items center
.v-btn--disabled
  opacity 1
</style>

<script>
import Timer from './Timer';

export default {
  name: 'FabGroup',
  components: {
    Timer,
  },
  computed: {
    total() {
      const { start, end } = this.$store.state.due;
      return parseInt((end - start) / 60000);
    },
    rest() {
      const { end } = this.$store.state.due;
      return Math.max(parseInt((end - Date.now()) / 60000), 0);
    },
  },
  props: {
    isUpDisabled: {
      type: Boolean,
      default: () => false,
    },
    isDownDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
