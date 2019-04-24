<script>
import LoginForm from "@/components/home/LoginForm.vue";
import Logo from "@/components/Logo.vue";

export default {
  components: {
    Logo,
    LoginForm
  }
};
</script>

<template>
  <div class="home">
    <Logo/>
    <LoginForm/>
  </div>
</template>