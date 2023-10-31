<template>
  <v-app-bar class="bg-green-darken-4">
    <v-app-bar-title class="text-yellow-accent-2">
      Sobat Miners
    </v-app-bar-title>
    
    <template v-slot:append>
      <v-tabs
        v-model="tab"
      >
        <v-tab href="/">Beranda</v-tab>
        <v-tab href="/produk">Product</v-tab>
        <v-tab ><a href="/login" style="text-decoration: none;" class="text-yellow-accent-2">Login</a></v-tab>
      </v-tabs>
    </template>
    </v-app-bar>
</template>
<script setup>
  //
</script>
