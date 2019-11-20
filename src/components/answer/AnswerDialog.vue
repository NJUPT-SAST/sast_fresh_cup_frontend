<template>
  <v-dialog
      :value="!hidden"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title>{{title}}</v-card-title>
        <v-card-text>{{content}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="$emit('handleDeny')"
          >
            {{deny}}
          </v-btn>
          <v-btn
            color="green"
            text
            style="color:white"
            @click="$emit('handleConfirm')"
          >
            {{confirm}}
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'AnswerDialog',
  props: {
    hidden: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => 'title',
    },
    content: {
      type: String,
      default: () => 'content',
    },
    confirm: {
      type: String,
      default: () => 'yes',
    },
    deny: {
      type: String,
      default: () => 'no',
    },
  },
  // methods: {
  //   handleLogout() {
  //     localStorage.removeItem('fresh_cup_token');
  //     this.$router.push({ name: 'homepage' });
  //   },
  // },
};
</script>
