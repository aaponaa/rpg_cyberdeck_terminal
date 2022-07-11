<template>
    <div class='grid'>
        <form @submit.prevent='submit' class='log'>
            <h3>Please sign in</h3>
            <label for='login'>Login: </label>
            <input v-model='value.login' type='text' placeholder='Login' required>
            <label for='password'>Password: </label>
            <input v-model='value.password' type='password' placeholder='Password' required>
            <button type='submit'>Submit</button>
        </form>
    </div>
</template>

<script lang='ts'>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'


export default {
    name: 'Login',
    setup() {
        const value = reactive({
            login: '',
            password: '',
        })
        const router = useRouter()
        const submit = async () => {
            fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value),
            }).then(response => response.json())
                .then(response => {
                    console.log(response)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response}`
                })
            await router.push('/userpage')
        }
        return {
            value,
            submit,
        }

    },
}

</script>

<style scoped>

.log {
    display: grid;
}
</style>