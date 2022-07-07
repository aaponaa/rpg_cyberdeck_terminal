<template>
  <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
    <div class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
        <use xlink:href="#bootstrap"/>
      </svg>
    </div>

      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <RouterLink class="navi" to="/">{{ $t('navbar.home') }}</RouterLink>
        </li>
        <li>
          <RouterLink class="navi" to="/sheet">{{ $t('navbar.sheet') }}</RouterLink>
        </li>
      </ul>

    <div class="col-md-3 d-flex align-items-center text-end gap-2">
        <template v-for="(availableLocale, index) in availableLocales" :key="availableLocale">
          <span class="locale" v-bind:class="{ active: locale === availableLocale}"
                @click="selectLanguage(availableLocale)">
            {{ availableLocale.toUpperCase() }}
          </span>
          <template v-if="index < availableLocales.length - 1"><span>|</span></template>
        </template>
<!--      </div>-->
<!--      <div class="d-flex flex-row gap-1">-->
        <button @click="$router.push('login')" type="button" class="btn btn-outline-primary">
          {{ $t('navbar.login') }}
        </button>
        <button @click="$router.push('register')" type="button" class="btn btn-primary">
          {{ $t('navbar.register') }}
        </button>
<!--      </div>-->
    </div>
  </header>
</template>

<script lang="ts">

import i18n, {availableLocales, updateLocale} from "@/i18n";

export default {
  name: 'NavBar',
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
    }

  }
}

</script>

<style scoped>

.navi {
  padding: 10px;
  color: #5a0b0d;
  font-size: 24px;

}

.btn-primary {
  background-color: #5a0b0d;
  border-color: #5a0b0d;
}

.btn-outline-primary {
  border-color: #5a0b0d;
  color: #5a0b0d;
}

.btn-primary:hover, .btn-primary:active {
  background-color: #723d3e;
}

.btn-outline-primary:hover, .btn-outline-primary:active {
  background-color: #c4b7b7;
}

.locale:not(.active) {
  cursor: pointer;
}

.locale:hover, .locale.active {
  text-decoration: underline;
}


</style>

