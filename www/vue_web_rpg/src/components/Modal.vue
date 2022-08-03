<script setup lang='ts'>
import { defineProps, ref } from 'vue'

const name = 'Modal'

const props = defineProps<{
    closeable: boolean,
    closeOnEscape: boolean,
    closeOnOverlayClick: boolean
}>()

const modal = ref<HTMLElement | null>(null)
const open = () => {
    const options = {
        keyboard: props.closeOnEscape,
        backdrop: props.closeOnOverlayClick ? true : 'static',
    }
    // @ts-ignore
    new bootstrap.Modal(modal.value, options).toggle()
}

defineExpose<{
    open: () => void
}>({
    open,
})

</script>
<template>
    <div ref='modal' class='modal' tabindex='-1'>
        <div class='modal-dialog'>
            <div class='modal-content'>
                <div class='modal-header'>
                    <template v-if='this.$slots.header'>
                        <slot name='header'></slot>
                    </template>
                    <template v-if='closeable'>
                        <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </template>
                </div>
                <div class='modal-body'>
                    <slot name='body'></slot>
                </div>
                <template v-if='this.$slots.footer'>
                    <div class='modal-footer'>
                        <slot name='footer'></slot>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>