<script setup lang='ts'>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'</script>

<template>
    <div class='wrapper'>
        <template v-if='currentUser'>
            <NavBar />
        </template>
        <RouterView />
    </div>
</template>

<script lang='ts'>

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        },
    },
})
</script>

<style lang='scss'>
@import './assets/base.css';
@import './assets/shadowrun.scss';
//@import "./node_modules/bootstrap-icons/font/bootstrap-icons.scss";

.wrapper {
    display: grid;
}

</style>
