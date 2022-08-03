<script setup lang='ts'>

import Modal from '@/components/Modal.vue'

</script>

<template>
    <h3>Here is your home where you have info about the project</h3>
    <h4>{{ $t('test') }}</h4>

    <button @click='$refs.modal.open()'>Open modal</button>
    <button @click='$refs.modal2.open()'>Open modal</button>

    <Modal ref='modal' :close-on-escape='false' :close-on-overlay-click='false' :closeable='true'>
        <template v-slot:body>
            Prout
        </template>
    </Modal>
    <Modal ref='modal2' :close-on-escape='true' :close-on-overlay-click='true' :closeable='false'>
        <template v-slot:header>
            <span> Test </span>
        </template>
        <template v-slot:body>
            Caca
        </template>
        <template v-slot:footer>
            <div class='d-flex flex-row w-100 justify-content-center'>
                Ay
            </div>
        </template>
    </Modal>

</template>

<style>

h3 {
    text-align: center;
    font-family: "Georgia", serif;
}

</style>