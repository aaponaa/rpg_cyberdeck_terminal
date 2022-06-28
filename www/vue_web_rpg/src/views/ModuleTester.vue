<template>

  <div class="sheet">

    <div v-for="articles in allArticles" :key="articles.id" class="articles">
      {{articles.item}}
    </div>

  </div>

</template>

<script lang="ts">
import {mapGetters} from "vuex";

export default {
  name: "ModuleTester",
  computed: mapGetters(['allArticles'])
}
</script>

<style scoped>

</style>