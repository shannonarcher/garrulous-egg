<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    userName: ""
  }),
  methods: {
    handleSubmit($event) {
      $event.preventDefault();
      this.login(this.userName);
    },
    ...mapActions({
      login: "users/login"
    })
  }
};
</script>

<template>
  <form class="login-form" @submit="handleSubmit">
    <input v-model="userName">
    <button>Play</button>
  </form>
</template>
