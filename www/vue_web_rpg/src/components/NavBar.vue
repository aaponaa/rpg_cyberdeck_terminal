<template>
  <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
    <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"/></svg>
    </a>

    <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
      <li><RouterLink class="navi" to="/">Home</RouterLink></li>
      <li><RouterLink class="navi" to="/charview" >Ma Fiche</RouterLink></li>
      <li><RouterLink class="navi" to="/charmod">Modif Fiche</RouterLink></li>
      <li><RouterLink class="navi" to="/userpage">Page Utilisateur</RouterLink></li>
      <li><RouterLink class="navi" to="/module">Module</RouterLink></li>
    </ul>

    <div class="col-md-3 text-end">
      <button @click="$router.push('login')" type="button" class="btn btn-outline-primary me-2">Login</button>
      <button @click="$router.push('register')" type="button" class="btn btn-primary">Sign-up</button>
    </div>
  </header>
</template>

<script lang="ts">
/*<v-img :src="currentLocaleImg" v-if="user"></v-img>*/
</script>

<style scoped>

.navi{
  padding: 10px;
  color: #5a0b0d;
  font-family: "Georgia", serif;
  font-size: 24px;

}
.btn-primary{
  background-color: #5a0b0d;
  border-color: #5a0b0d;
}
.btn-outline-primary{
  border-color: #5a0b0d;
  color: #5a0b0d;
}
.btn-hover-bg{
  color: #5a0b0d !important;
}

</style>

