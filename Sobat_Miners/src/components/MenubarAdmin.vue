<template>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        prepend-icon="mdi-account"
        :title="admin.name"
        nav
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="Produk" :to="{name:'Produk'}"></v-list-item>
        <v-list-item prepend-icon="mdi-home-city" title="KoinProd" :to="{name:'KoinProd'}"></v-list-item>
        <v-list-item prepend-icon="mdi-home-city" title="Category" :to="{name:'Category'}"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="User" :to="{name:'UserInfo'}"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="Topup Log" :to="{name:'UserTopup'}"></v-list-item>
        <v-list-item>
          <v-btn @click="logout()" width="100%">Logout</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
  import router from '@/router';
  import axios from '@/services/api';
  export default {
    data () {
      return {
        admin: JSON.parse(localStorage.getItem('user')),
        token: JSON.parse(localStorage.getItem('token')),
        drawer: true,
        rail: true,
      }
    },
    methods: {
      async logout() {
        await axios.post('user/logout', null, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          router.push({ path: '/admin/login' });
        })
      }
    },
    mounted() {
      // console.log(this.admin.name);
    },
  }
</script>