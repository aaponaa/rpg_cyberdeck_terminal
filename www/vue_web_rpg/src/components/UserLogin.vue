<script setup lang="ts">


</script>


<template>
  <div class="login_grid">
    <div class="login">
      <form method="post" action="http://localhost:8080/auth/login">
        <div>
          <label for="login">Login : </label>
          <input type="text" name="login" id="login" required>
        </div>
        <div>
          <label for="password">Password : </label>
          <input type="password" name="password" id="password" required>
        </div>
        <div>
          <input type="submit" name="submit" value="Submit">
        </div>
      </form>
    </div>
  </div>
</template>

<style>

.login_grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.login{
  grid-row: 2;
}
</style>