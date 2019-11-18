<template>
  <v-sheet
    class="side-bar-item"
    :elevation="isFocus ? 7 : 0 "
    :height="isOver ? 80 : 70"
    :color="answered ? '#039BE5' : '#E0F2F1'"
    :style="itemStyle"
    @click="$emit('click')"
    @mouseenter="handleMouseMove"
    @mouseleave="handleMouseOut"
  >
    <div
      class="side-bar-item-text"
      :style="{color: answered ? 'white' : 'black' }"
    >{{sequence}}. {{text}}</div>
  </v-sheet>
</template>
<script>
export default {
  name: 'SideBarItem',
  data() {
    return {
      isOver: false,
    };
  },
  props: {
    text: {
      type: String,
      default: () => 'question-name',
    },
    answered: {
      type: Boolean,
      default: () => false,
    },
    selected: {
      type: Boolean,
      default: () => false,
    },
    sequence: {
      type: Number,
      default: () => 0,
    },
  },
  methods: {
    handleMouseMove() {
      setTimeout(() => {
        this.isOver = true;
      });
    },
    handleMouseOut() {
      setTimeout(() => {
        this.isOver = false;
      }, 80);
    },
  },
  computed: {
    itemStyle() {
      const margin = this.selected ? '14px' : (this.isFocus ? '22px' : '8px');
      const width = this.selected ? '94%' : (this.isFocus ? '92%' : '90%');
      return { marginTop: margin, marginBottom: margin, width };
    },
    isFocus() {
      return this.selected || this.isOver;
    },
  },
};
</script>


<style lang="stylus">
// #ECEFF1
.side-bar-item
  margin 0 auto
  margin-left 10px
  margin-top 8px
  margin-bottom 8px
  cursor pointer
  display flex
  user-select none
  padding-left 10%
  justify-content flex-start
  align-items center
  .side-bar-item-text
    font-size 18px
    text-align center
</style>
