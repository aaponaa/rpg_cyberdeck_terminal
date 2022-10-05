<script setup lang='ts'>

import { computed, ComputedRef, onMounted, ref } from 'vue'
import store from '@/store'
import type { Sheet } from '@/modules/sheets/models/sheet.model'
import PersonalDataCard from '@/modules/sheets/components/PersonalDataCard.vue'
import AttributeCard from '@/modules/sheets/components/AttributesCard.vue'
import sheetMessages from '@/modules/sheets/locales'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const name = 'CharacterSheet'
const route = useRoute()
const { t } = useI18n({
    messages: sheetMessages,
})
const loading = ref(false)
const sheet = computed<Sheet>(() => store.state.sheet.sheet ?? null) as ComputedRef<Sheet>
const selectedTab = ref('general')

const handleChange = (event) => {
    console.log('New value: ')
    console.log(sheet.value)
}

onMounted(() => {
    loading.value = true
    store.dispatch('fetchSheet', route.params.id).then(response => {
            loading.value = false
        },
        onerror => {
            loading.value = false
        })
})

</script>

<template>
    <div class='h-100 p-3'>
        <template v-if='loading'>
            <div class='loading'></div>
        </template>
        <template v-if='sheet'>
            <!-- TODO: everything -->
            <ul class='nav nav-tabs'>
                <li class='nav-item'>
                    <button class='nav-link'
                            :class='selectedTab === "general" ? "active" : ""'
                            id='home-tab'
                            data-bs-toggle='tab'
                            data-bs-target='#general'
                            aria-controls='general'
                            type='button' role='tab'
                            :aria-selected='selectedTab === "general" ? "true" : "false"'>
                        {{ t('sheet.tabs.general') }}
                    </button>
                </li>
            </ul>

            <div class='tab-content' id='myTabContent'>
                <div class='fade show'
                     :class='selectedTab === "general" ? "active" : ""'
                     id='general'
                     role='tabpanel'
                     aria-labelledby='general'
                     tabindex='0'>

                    <PersonalDataCard :sheet='sheet' @update='handleChange'></PersonalDataCard>

                    <AttributeCard :sheet="sheet" @update="handleChange"></AttributeCard>
                </div>
            </div>
        </template>
    </div>

</template>

<style scoped lang='scss'>

#general {
    display: grid;
    grid-template-columns: auto;
    grid-gap: 2rem;
}

@media (min-width: 1350px) {
    #general {
        grid-template-columns: auto auto;
    }
}

</style>