
<template>
  <form @submit.prevent="submit">
    <h1>Please sign in</h1>

    <input v-name="login" type="text" placeholder="Login" required>

    <input name="password" type="password" placeholder="Password" required>

    <button type="submit">Sign in</button>
  </form>
</template>


<script setup lang="ts">

import {reactive} from 'vue';
import {useRouter} from "vue-router";

export default {
  name: "UserLogin",
  setup() {
    const data = reactive({
      login: '',
      password: ''
    });
    const router = useRouter();
    const submit = async () => {
      await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data)
      });
      await router.push('/');
    }
    return {
      data,
      submit
    }
  }
}

</script>



<style>

.login_grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.login{
  grid-row: 2;
}
</style>