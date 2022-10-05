<script setup lang="ts">
import type { Sheet } from '@/modules/sheets/models/sheet.model'
import { useI18n } from 'vue-i18n'
import sheetMessages from '@/modules/sheets/locales'

const name = "AttributesCard"

const { t } = useI18n({
  messages: sheetMessages,
})

const props = defineProps<{
  sheet: Sheet
}>()

const emit = defineEmits<{
  (e: 'update'): void
}>()

const valueState: string[] = [' ', 'modifiers', 'value', 'max']

const fieldGroup: string[] = ['Physiques', 'modifiers', 'value', 'max']

const fields = [
  {
    name: 'body',
    editable: true,
  },
  {
    name: 'agility',
    editable: true,
  },
  {
    name: 'reaction',
    editable: true,
  },
  {
    name: 'strength',
    editable: true,
  },
  {
    name: 'willpower',
    editable: true,
  },
  {
    name: 'logic',
    editable: true,
  },
  {
    name: 'intuition',
    editable: true,
  },
  {
    name: 'charisma',
    editable: true,
  },
  {
    name: 'technomancy',
    editable: true,
  },
  {
    name: 'magic',
    editable: true,
  },
  {
    name: 'essence',
    editable: true,
  },
  {
    name: 'luck',
    editable: true,
  },
]

</script>

<template>
  <template v-if="sheet">

    <div class='article'>

      <h2><span>{{ t('sheet.attributes.label') }}</span><span></span></h2>

      <table>
        <thead>
        <tr>
          <th v-for="text in valueState">{{text}}</th>
        </tr>
        </thead>

        <template v-for='field in fields' :key='field.name'>

          <tbody>
          <tr>
            <td>{{ t('sheet.attributes.' + field.name) }}</td>
            <template v-if='field.editable'>
              <td>{{sheet.attributes[field.name].modifiers}}</td>
              <td><input name='keys' class='my-num' type="number" v-model='sheet.attributes[field.name].value'
                     @change='emit("update")'></td>
              <td>{{sheet.attributes[field.name].max}}</td>
            </template>
          </tr>
          </tbody>

        </template>
      </table>


    </div>
  </template>
</template>

<style scoped lang='scss'>

.attribute_{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.my-num{
  width: 40px;
  border: none;
  cursor: pointer;
  background: url(../images/button/Reset2.png) no-repeat;
}

dl {
  grid-template-columns: auto auto auto auto;
}
</style>