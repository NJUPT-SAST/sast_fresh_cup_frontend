<template>
  <div>
    <timer />
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
};
</script>
