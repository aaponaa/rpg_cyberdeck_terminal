<script setup lang='ts'>

import { useStore } from 'vuex'
import type { StoreState } from '@/store'
import { availableLocales, updateLocale } from '@/i18n'
import { useI18n } from 'vue-i18n'

const name = 'NavBar'
const store = useStore<StoreState>()
const { t, locale } = useI18n()
const logo = new URL('../assets/shadowrun_logo.png', import.meta.url)

const selectLanguage = (l: string) => {
    updateLocale(l)
}

const logout = () => {
    store.dispatch('auth/logout')
}

</script>

<template>

    <nav class='navbar navbar-expand-lg bg-light sticky-top shadowrun'>
        <div class='container-fluid'>
            <button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbar'
                    aria-controls='navbar' aria-expanded='false' aria-label='Toggle navigation'>
                <span class='navbar-toggler-icon'></span>
            </button>
            <div class='collapse navbar-collapse' id='navbar'>
                <a class='navbar-brand' href='#'><img :src='logo' height='40' alt='Shadowrun'></a>
                <ul class='navbar-nav me-auto mb-2 mb-lg-0'>
                    <li class='nav-item'>
                        <RouterLink class='nav-link' active-class='active' to='/'>{{ $t('home') }}</RouterLink>
                    </li>
                    <li class='nav-item'>
                        <RouterLink class='nav-link' active-class='active' to='/sheets'>{{ $t('myCharacters') }}
                        </RouterLink>
                    </li>
                </ul>
                <div class='d-flex align-items-center gap-1'>
                    <template v-for='(availableLocale, index) in availableLocales' :key='availableLocale'>
          <span class='locale' v-bind:class='{ active: locale === availableLocale}'
                @click='selectLanguage(availableLocale)'>
            {{ availableLocale.toUpperCase() }}
          </span>
                        <template v-if='index < availableLocales.length - 1'><span>|</span></template>
                    </template>
                    <div class='ps-3'>
                        <button @click='logout()' type='button' class='btn btn-primary' :title="$t('logout')">
                            <span><i class='bi bi-box-arrow-right'></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

</template>

<style scoped lang='scss'>

@import '../assets/shadowrun.scss';

nav ul {
    /*padding: 10px;*/
    color: #5a0b0d;
    font-size: 22px;

}

.navbar-brand {
    color: $primary;
}

.navbar-nav .nav-link.active, .navbar-nav .show > .nav-link {
    color: $primary;
}

.locale:not(.active) {
    cursor: pointer;
}

.locale:hover, .locale.active {
    text-decoration: underline;
}


</style>

