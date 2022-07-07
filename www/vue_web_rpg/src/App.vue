<script setup lang="ts">
import {RouterView} from 'vue-router'
import NavBar from "@/components/NavBar.vue";</script>

<template>
  <div class="wrapper">
    <NavBar/>
    <RouterView/>
  </div>
</template>

<script lang="ts">

export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './assets/base.css';
//@import "./node_modules/bootstrap-icons/font/bootstrap-icons.scss";

.wrapper {
  display: grid;
}

</style>
