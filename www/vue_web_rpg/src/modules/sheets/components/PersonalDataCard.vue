<script setup lang='ts'>
import type { Sheet } from '@/modules/sheets/models/sheet.model'
import { useI18n } from 'vue-i18n'
import sheetMessages from '@/modules/sheets/locales'

const name = 'PersonalDataCard'
const { t } = useI18n({
    messages: sheetMessages,
})

const props = defineProps<{
    sheet: Sheet
}>()

const emit = defineEmits<{
    (e: 'update'): void
}>()

const fields = [
    {
        name: 'name',
        editable: true,
    },
    {
        name: 'metatype',
        editable: true,
    },
    {
        name: 'ethnicity',
        editable: true,
    },
    {
        name: 'age',
        editable: true,
    },
    {
        name: 'sex',
        editable: true,
    },
    {
        name: 'height',
        editable: true,
    },
    {
        name: 'weight',
        editable: true,
    },
    {
        name: 'streetCred',
        editable: true,
    },
    {
        name: 'notoriety',
        editable: true,
    },
    {
        name: 'publicAwareness',
        editable: true,
    },
    {
        name: 'karma',
        editable: true,
    },
    {
        name: 'totalKarma',
        editable: false,
    },
]

</script>
<template>
    <template v-if='sheet'>

        <div class='article'>

            <h2><span>{{ t('sheet.personalData') }}</span><span></span></h2>

            <dl>
                <template v-for='field in fields' :key='field.name'>
                    <dt>
                        {{ t('sheet.' + field.name) }}
                    </dt>
                    <dd>
                        <template v-if='field.editable'>
                            <input name='keys' class='my-but' v-model='sheet.personalData[field.name]'
                                   @change='emit("update")'>
                        </template>
                        <template v-else>
                            {{ sheet.personalData[field.name] }}
                        </template>
                    </dd>
                </template>

            </dl>
        </div>
    </template>
</template>

<style scoped lang='scss'>

dl {
    grid-template-columns: auto auto auto auto;
}
</style>