<template>
  <v-dialog
    v-model="showDetail"
    persistent
  >
    <v-card>
      <v-card-title class="text-amber-darken-1 bg-green-darken-4">
        <span class="text-h5">Top Up {{ topupDetail._id }}</span>
      </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                <v-col cols="6">
                    <div>{{ topupDetail.invoice }}</div>
                </v-col>
                <v-col cols="6">
                    <div>{{ topupDetail.user._id }}</div>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="12">
                    <div>{{ topupDetail.user.name }}</div>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="12">
                    <div>{{ topupDetail.total }}</div>
                </v-col>
                </v-row>
                <div>Admin</div>
                <hr/>
                <v-row>
                <v-col cols="6">
                    <div>{{ topupDetail.admin._id }}</div>
                </v-col>
                <v-col cols="6">
                    <div>{{ topupDetail.admin.name }}</div>
                </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green-darken-4"
                variant="text"
                @click="showDetail = false"
            >
                Ok
            </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card>
    <v-layout>
      <MenubarAdmin />
      <v-main style="min-height: 700px;">
        <v-container fluid>
          <v-table
            fixed-header
          >
            <thead>
              <tr>
                <th class="text-left">
                  Invoice
                </th>
                <th class="text-left">
                  ID
                </th>
                <th class="text-left">
                  Nama
                </th>
                <th class="text-left">
                  Top Up
                </th>
                <th class="text-left">
                  Check
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user._id"
              >
                <td>{{ user.invoice }}</td>
                <td>{{ user.user._id }}</td>
                <td>{{ user.user.name }}</td>
                <td>{{ user.total }}</td>
                <td>
                  <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="openDetail(user, true)"
                  >
                    Lihat
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
  import MenubarAdmin from '@/components/MenubarAdmin.vue';
  import router from '@/router';
  import axios from '@/services/api';

  export default {
    data() {
      return {
        token: JSON.parse(localStorage.getItem("token")),
        users: {},
        showDetail: null,
        topupDetail: null
      }
    },
    components: {
      MenubarAdmin
    },
    methods: {
      async loadHistoryTopup() {
        await axios.get('topup/readAll', {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.users = res.data;
        })
      },
      async openDetail(data, show) {
        this.showDetail = show;
        this.topupDetail = data;
      }
      // async viewHistoryDetail(idTopup) {
      //   await axios.get('topup/read/' + idTopup, {
      //     headers: {
      //       Authorization: 'Bearer ' + this.token
      //     }
      //   })
      //   .then((res) => {
      //     this.topupDetail = res.data;
      //   })
      // },
    },
    beforeMount() {
      if(!this.token) {
        router.push('/admin/login');
      }
    },
    mounted() {
      this.loadHistoryTopup();
    }
  }
</script>