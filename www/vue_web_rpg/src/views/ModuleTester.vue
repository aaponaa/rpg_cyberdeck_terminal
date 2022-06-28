<template v-if="allArticles">

  <div class="sheet">

    <div v-for="items in allArticles" :key="items.id" class="articles">
      <h2><span>{{items.name}}</span></h2>
      <dl v-for="(value, keys) in items.attributes" :key="keys" class="items">
        {{keys}}: <input name="keys" class="form-control" :value=value>
      </dl>


      <table :key="items" class="items">
      <thead>
        <tr>
          <th v-for="keys in items.row" :key="keys" class="col">{{keys}}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, keys) in items.row" :key="keys">
          <td >{{value}}</td>
        </tr>
      </tbody>

      </table>
    </div>

  </div>

</template>

<script lang="ts">
import {mapGetters, mapActions} from "vuex";

export default {

  name: "ModuleTester",
  methods: {
    ...mapActions(['fetchSheet']),
    ...mapActions(['columnNames'])
  },
  computed: {
    ...mapGetters(["allArticles"])},
  created() {
    this.fetchSheet(); // TODO look why have a red underline XD
  },


}
</script>

<style scoped>

.articles{
  background-color: #cccccc;
  padding: 20px;
  margin: 30px;
}

</style>