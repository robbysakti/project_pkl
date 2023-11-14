<template>
  
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <HelloWorld />
      <ListProduk />
    </v-responsive>
  </v-container>
</template>

<script setup>
  import HelloWorld from '@/components/HelloWorld.vue'
  import ListProduk from '@/components/ListProduk.vue';
</script>
