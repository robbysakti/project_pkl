<template>
  <v-app-bar class="bg-green-lighten-3">
      <template v-slot:prepend><v-img src="/logo.png" style="width: 80px;"></v-img></template>
    <v-app-bar-title class="text-green-darken-4" style="font-size: 25px;">
      SOBAT MINERS
    </v-app-bar-title>
    <v-btn size="large" class=" text-green-darken-4" :to="{name: 'Home'}">Beranda</v-btn>
    <v-btn size="large" class=" text-green-darken-4" :to="{name:'ProdukDetail'}">Product</v-btn>
    <v-btn size="large" class="bg-amber-darken-1 text-green-darken-4" :to="{name:'Admin'}">Login</v-btn>
    </v-app-bar>
</template>
<script>
</script>
