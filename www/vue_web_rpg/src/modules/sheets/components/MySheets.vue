<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import type { Sheet } from '@/modules/sheets/models/sheet.model'
import { joinWithSlash } from '@/modules/common/services/url-utils'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { StoreState } from '@/store'

const name = 'MySheets'
const store = useStore<StoreState>()
const { t } = useI18n()

const loading = ref(false)
const sheets = computed<Sheet[]>(() => store.state.sheet.sheets)
const characterImageUrl = (id: string) => {
    return joinWithSlash(import.meta.env.VITE_API_URL, `sheets/${id}/image`)
}

onMounted(() => {
    loading.value = true
    store.dispatch('fetchSheets').then(results => {
        loading.value = false

    })
})
</script>
<template>
    <div class='h-100 p-3'>
        <template v-if='loading'>
            <div class='loading'></div>
        </template>

        <template v-if='!loading && sheets'>
            <div class='row' data-masonry='{&quot;percentPosition&quot;: true }' style='position: relative'>
                <template v-for='sheet in sheets' :key='sheet.id'>
                    <div class='col-sm-12 col-lg-6 pb-4'>
                        <RouterLink :to='"/sheets/" + sheet.id' tag='div' class='card pointer' style='text-decoration: none'>
                            <div class='card-body' style='height: fit-content'>
                                <div class='d-flex flex-row align-items-center' style='gap: 1rem'>
                                    <div class='d-flex flex-column'>
                                        <img :src='characterImageUrl(sheet.id)' :alt='sheet.image ?? "unknown"'
                                             width='100'
                                             style='border-radius: 50%' />
                                    </div>
                                    <div class='d-flex flex-column flex-fill'>
                                        <h1 class='name'>{{ sheet.personalData.name }}</h1>
                                        <h2 class='meta'>{{ t('sheet.metatype.' + sheet.personalData.metatype) }} /
                                            {{ t('sheet.archetype.' + sheet.personalData.archetype) }}</h2>
                                        <template v-if='sheet.campaign'>
                                            <span class='fst-italic'>{{ t('campaign') }} : {{ sheet.campaign.name
                                                }}</span>
                                        </template>
                                        <template v-else>
                                            <span class='fst-italic'>{{ t('campaign') }} : {{ t('none.f') }}</span>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped lang='scss'>

@import '../../../assets/shadowrun';

.name {
    color: $primary;
}

a.card {
    color: unset
}

.card.pointer:hover {
    border-color: $primary !important;
}

.sheet {
    margin: auto;
    padding: 12px;
    max-width: 100vh;
}

.but-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: max-content;

}

.delete {
    width: 40px;
}

h2 span:first-child {
    /*padding: 0.1em 0 0.1em 0.3em;*/
    /*color: #fff;*/
    /*background-color: #5a0a0d;*/
}

dl {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 820px;
}

.attri {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

}

dl, dd, dt {
    padding-right: 5px;
}

.my-but {
    border: none;
    cursor: pointer;
    width: max-content;
    background: url(../images/button/Reset2.png) no-repeat;
}


</style>