<template v-if="allArticles">

  <div class="sheet">
    <input type="submit" style="color: transparent; background-color: transparent; border-color: transparent; cursor: default;">
    <div v-for="items in allArticles" :key="items.id" class="articles">

      <h2><span>{{items.name}}</span><span></span></h2>

      <p v-if="items.notes !== undefined"><strong>Notes : </strong>{{ items.notes }}</p>
      <div v-if="items.attributes !== undefined " class="attributes">
        <dl>
          <div v-for="(value, keys) in items.attributes" :key="keys" class="attri">
            <dt>{{keys}}: </dt><dd><input name="keys" class="my-but" :value=value></dd>
          </div>
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
    ...mapActions(['fetchSheet'])
  },
  computed: {
    ...mapGetters(["allArticles"])},
  created() {
    this.fetchSheet(); // TODO look why have a red underline XD
  },

}
</script>

<style scoped>

.attri{

}


h2 span:first-child {
  padding: 0.1em 0 0.1em 0.3em;
  color: #fff;
  background-color: #5a0a0d;
}

dl{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.attri{
  display: grid;
  grid-template-columns: repeat(2, 1fr);

}

dl, dd, dt{
  padding-right: 5px;
}



</style>