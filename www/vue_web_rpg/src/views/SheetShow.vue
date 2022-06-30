<template v-if="sheet">

  <div class="sheet">
    <input type="submit"
           style="color: transparent; background-color: transparent; border-color: transparent; cursor: default;">
    <div v-for="item in sheet" :key="item.id" class="articles">

      <h2><span>{{ item.name }}</span><span></span></h2>

      <p v-if="item.notes"><strong>Notes : </strong>{{ item.notes }}</p>
      <div v-if="item.attributes" class="attributes">
        <dl>
          <div v-for="(value, key) in item.attributes" :key="key" class="attri">
            <dt>{{ key }}:</dt>
            <dd><input name="keys" class="my-but" v-model="item.attributes[key]" @change="handleChange($event, item.attributes[key])"></dd>
          </div>
        </dl>
      </div>


      <table v-if="item.row" :key="item" class="table table-striped table-sm">
        <thead>
        <tr>
          <th scope="col" v-for="key in item.rowkeys" :key="key" class="col">{{ key }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in item.row" :key="item">
          <td v-for="key in item.rowkeys">{{ row[key] }}</td>
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

    handleChange(event, value) {
      console.log("New value: " + value);
      // Todo: call back-end to update sheet
    }
  },
  computed: {
    ...mapGetters(["sheet"])
  },
  created() {
    this.fetchSheet(); // TODO look why have a red underline XD
    // Because the function does exist (it's extracted by the mapActions), but it's not explicitly declared so the IDE doesn't know?
  },

}
</script>

<style scoped>

.attri {

}


h2 span:first-child {
  padding: 0.1em 0 0.1em 0.3em;
  color: #fff;
  background-color: #5a0a0d;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.attri {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

}

dl, dd, dt {
  padding-right: 5px;
}

.my-but {
  border-color: #eeeeee;
}


</style>