<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div class="wrapper">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Connection</RouterLink>
      <RouterLink to="/register">Inscription</RouterLink>
      <RouterLink to="/charview">Ma Fiche</RouterLink>
      <RouterLink to="/charmod">Modif Fiche</RouterLink>
    </nav>
  </div>
  <div class="corp">
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/base.css';


@media (hover: hover) {
  a:hover {
    background-color: #cccccc;
  }
}
.wrapper{
  grid-column: 2;
}
li{
  text-align: center;
}

nav{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.corp {
  grid-column: 1/4;
  grid-row: 2;
}

nav a.router-link-exact-active {
  color: #5a0a0d;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  text-align: center;
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {


  #app {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    grid-auto-rows: minmax(100px, auto);
    align-content: center;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
