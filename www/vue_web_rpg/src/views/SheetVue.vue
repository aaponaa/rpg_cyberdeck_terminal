<template>

  <CoreCard :value="sheet" :attributes="['name', 'ethnicity', 'age']"/>

</template>
<script lang="ts">
export default defineComponent({
  name: 'SheetVue',
  computed(): {
    sheet(): Ref<Sheet> {
    return ref(this.$store.getters["sheet"]()); // je sais plus exactement
  }
}

});
</script>

<style scoped>

</style>