<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue";

</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
  <div class="warpper">
    <NavBar/>
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/base.css';

.warpper{
  display: grid;
}

</style>
