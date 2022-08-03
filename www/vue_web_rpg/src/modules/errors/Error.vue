<script setup lang='ts'>

import { defineProps } from 'vue'
import type { AxiosError } from 'axios'

const errorImage = new URL('../../assets/gameover.png', import.meta.url)

const props = defineProps<{
    error: AxiosError
}>()

</script>

<template>
    <div id='error' class='d-flex flex-row align-items-center'>
        <div class='flex-column'>
            <img :src='errorImage' alt='Error' width='150' />
        </div>
        <div class='flex-column text-danger'>
            <h1>{{ error.response.status }} {{ error.response.statusText }}</h1>
            <h2>{{ error.code }}</h2>
        </div>
    </div>
</template>

<style scoped>

#error {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -250px;
    width: 500px;
    height: 300px;
}
</style>