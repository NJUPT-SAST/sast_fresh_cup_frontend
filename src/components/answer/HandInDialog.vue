<template>
  <v-dialog
      :value="showDone"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>确认要提交交卷吗？</v-card-title>
        <v-card-text>是否确认要交卷？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="$emit('handleClose')"
          >
            取消
          </v-btn>
          <v-btn
            color="green"
            text
            style="color:white"
            @click="$router.push({name:'homepage'})"
          >
            确认交卷
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'HandInDialog',
  props: {
    showDone: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
