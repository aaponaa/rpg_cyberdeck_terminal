<template v-if="allArticles">

  <div class="sheet">
    <input type="submit" style="color: transparent; background-color: transparent; border-color: transparent; cursor: default;">
    <div v-for="items in allArticles" :key="items.id" class="articles">

      <h2><span>{{items.name}}</span><span></span></h2>

      <div v-if="items.attributes !== undefined " class="attributes">
        <dl v-for="(value, keys) in items.attributes" :key="keys" class="items">
          {{keys}}: <input name="keys" class="form-control" :value=value>
        </dl>
      </div>


      <table :key="items" class="table table-striped table-sm">
      <thead>
        <tr>
          <th scope="col" v-for="keys in items.rowkeys" :key="keys" class="col">{{keys}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in items.row" :key="items">
          <td v-for="keys in items.rowkeys">{{row[keys]}}</td>
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

h2 span:first-child {
  padding: 0.1em 0 0.1em 0.3em;
  color: #fff;
  background-color: #5a0a0d;
}


</style>