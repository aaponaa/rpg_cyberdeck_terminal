
<template>
  <div class="grid">
  <form @submit.prevent="submit" class="log">
    <h3>Please register</h3>
    <label for="login">Login: </label>
    <input v-model="data.login" class="form-control" placeholder="Name" required>
    <label for="password">Password: </label>
    <input v-model="data.password" type="password" class="form-control" placeholder="Password" required>
    <button type="submit">Submit</button>
  </form>
  </div>
</template>

<script lang="ts">
import {reactive} from 'vue';
import {useRouter} from "vue-router";

export default {
  name: "Register",
  setup() {
    const data = reactive({
      login: '',
      password: ''
    });
    const router = useRouter();
    const submit = async () => {
      console.log(data)
      await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
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