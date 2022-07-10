<template>

  <nav class="navbar navbar-expand-lg bg-light sticky-top shadowrun">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"
              aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar">
        <a class="navbar-brand" href="#"><img :src="logo" height="40" alt="Shadowrun"></a>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/">{{ $t('home') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/sheet">{{ $t('sheet') }}</RouterLink>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-1">
          <template v-for="(availableLocale, index) in availableLocales" :key="availableLocale">
          <span class="locale" v-bind:class="{ active: locale === availableLocale}"
                @click="selectLanguage(availableLocale)">
            {{ availableLocale.toUpperCase() }}
          </span>
            <template v-if="index < availableLocales.length - 1"><span>|</span></template>
          </template>
          <!--      </div>-->
          <!--      <div class="d-flex flex-row gap-1">-->
          <div class="ps-3">
            <button @click="logout()" type="button" class="btn btn-primary" :title="$t('logout')">
              <span><i class="bi bi-box-arrow-right"></i></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!--  </header>-->
</template>

<script lang="ts">

import i18n, {availableLocales, updateLocale} from "@/i18n";
import {defineComponent} from "vue";

export default defineComponent({
  name: 'NavBar',
  data() {
    return {
      logo: new URL('../assets/shadowrun_logo.png', import.meta.url)
    };
  },
  computed: {
    locale(): string {
      return i18n.global.locale
    },
    availableLocales(): string[] {
      return availableLocales;
    }
  },
  methods: {
    selectLanguage(l: string): void {
      updateLocale(l);
    },

    logout(): void {
      this.$store.dispatch('auth/logout');
    }

  }
});

</script>

<style scoped lang="scss">

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

