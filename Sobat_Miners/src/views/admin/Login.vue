<template>
    <LoginModal />
</template>

<script setup>
    import LoginModal from '@/components/LoginModal.vue';
    import router from '@/router';
    import { onBeforeMount } from 'vue';

    const token = JSON.parse(localStorage.getItem("token"));

    onBeforeMount(() => {
        if(token) {
            router.push('/admin/produk');
        }
    })
</script>  