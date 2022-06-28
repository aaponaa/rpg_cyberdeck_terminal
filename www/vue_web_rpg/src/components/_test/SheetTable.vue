<template>

</template>

<script>
import Vue from "vue";
import {mapGetters, mapActions} from "vuex";

Vue.createApp({
  template: `
    <table class="table">
      <thead>
        <tr>
          <th scope="col" v-for="column in columnNames">{{column}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in info" :key="row">
          <td v-for="column in columnNames">{{row[column]}}</td>
        </tr>
      </tbody>
    </table>
    `,
  computed: {
    columnNames: function() {
      const names = new Set();
      for (const row of this.items.row) {
        for (const key of Object.keys(row)) {
          names.add(key);
        }
      }
      return names;
    }
  },
  data() {
    return {
      ...mapGetters(["allArticles"]),
    }
  }
}).mount('#example');
</script>

<style scoped>

</style>