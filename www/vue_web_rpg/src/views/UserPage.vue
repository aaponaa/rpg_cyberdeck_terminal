
<template>
  <div class="grid">
    <div>
  {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, ref} from 'vue';
import {useStore} from "vuex";

export default {
  name: "UserPage",
  setup() {
    const message = ref('You are not logged in!');
    const store = useStore();
    onMounted(async () => {
      try {// TODO : Get the cookie with the fetch to passs the login the api works on débug just undefined token in fetch
        const response = await fetch('http://localhost:8080/auth/login', {
          // Method GET by default
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          credentials: 'include'
        });

        console.log(response)
        const content = await response.json();
        message.value = `Hi ${content.login}`;
        await store.dispatch('setAuth', true);
      } catch (e) {
        await store.dispatch('setAuth', false);
      }
    });

    return {
      message
    }
  }
}
</script>