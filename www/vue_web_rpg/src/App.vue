<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue";

</script>

<template>
  <div class="wrapper">
    <NavBar/>
  </div>
  <div class="corp">

    <RouterView />
  </div>
</template>

<style>
@import '@/assets/base.css';
</style>
