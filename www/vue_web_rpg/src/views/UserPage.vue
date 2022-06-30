
<template>
  <div class="grid">
    <div>
  {{ message }}
    </div>
  </div>
</template>

<script lang="ts">

import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

export default {
  name: "Home",
  setup() {
    const message = ref('');
    const router = useRouter();
    onMounted(async () => {
      try {
        const {data} = await axios.get('http://localhost:8080/auth/login');
        message.value = `Hi ${data.login}`;
        console.log(data)
      } catch (e) {
        await router.push('/login');
      }
    });
    const logout = async () => {
      await axios.post('logout', {}, {withCredentials: true});
      axios.defaults.headers.common['Authorization'] = '';
      await router.push('/login');
    }

    return {
      message,
      logout
    }
  }
}

</script>