
<template>
  <div class="grid">
    <form @submit.prevent="submit" class="log">
      <h3>Please sign in</h3>
      <label for="login">Login: </label>
      <input v-model="data.login" type="text" placeholder="Login" required>
      <label for="password">Password: </label>
      <input v-model="data.password" type="password" placeholder="Password" required>
      <button type="submit">Submit</button>
    </form>
    </div>
</template>

<script lang="ts">
import {reactive} from 'vue';
import {useRouter} from "vue-router";

export default {
  name: "Login",
  setup() {
    const data = reactive({
      login: '',
      password: ''
    });
    const router = useRouter();
    const submit = async () => {
      await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(data)
      });
      await router.push('/userpage');
    }
    return {
      data,
      submit
    }
  }
}
</script>

<style scoped>

.log{
  display: grid;
}
</style>