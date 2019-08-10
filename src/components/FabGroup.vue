<template>
  <div>
    <timer
      :total="total"
      :rest="rest"
    />
    <v-btn
      right
      fab
      bottom
      fixed
      large
      color="green"
      style="color:white"
    >
      <v-icon>done</v-icon>
    </v-btn>
  </div>
</template>
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
};
</script>
