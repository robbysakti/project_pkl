<template>
    <v-app>
      <v-app-bar class="bg-green-lighten-3">
        <template v-slot:prepend><v-img src="/logo.png" style="width: 80px;"></v-img></template>
        <v-app-bar-title class="text-green-darken-4" style="font-size: 25px;">
          SOBAT MINERS
        </v-app-bar-title>
      </v-app-bar>
      <default-view />
    </v-app>
</template>
  
<script setup>
  import { onBeforeMount } from 'vue';
  import DefaultView from './View.vue';
  import router from '@/router';
  
  const token = JSON.parse(localStorage.getItem("token"));

  onBeforeMount(() => {
    try{
      if(!token) {
        router.push('/admin/login');
      }
    }
    catch(err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  })
</script>
    