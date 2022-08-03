<script setup lang='ts'>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Error from '@/modules/errors/Error.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import type { StoreState } from '@/store'

const name = 'App'
const store = useStore<StoreState>()

const currentUser = computed(() => store.state.auth.user)
const error = computed(() => store.state.global.error)

</script>

<template>
    <!--    <div class='wrapper'>-->
    <template v-if='currentUser'>
        <NavBar />
    </template>
    <template v-else></template>

    <template v-if='error'>
        <Error :error='error' />
    </template>
    <template v-else>
        <RouterView />
    </template>
    <!--    </div>-->
</template>

<style lang='scss'>

.wrapper {
    height: 100%;
    display: grid;
}

</style>
