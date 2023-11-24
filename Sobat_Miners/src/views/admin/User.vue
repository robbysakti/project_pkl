<template>
  <v-dialog
    v-model="showTopup"
    persistent
  >
    <v-card>
      <v-card-title class="text-amber-darken-1 bg-green-darken-4">
        <span class="text-h5">Top Up</span>
      </v-card-title>
      <v-form validate-on="submit lazy" @submit.prevent="topup()">
          <v-card-text>
              <v-container>
                  <v-row>
                  <v-col cols="6">
                      <v-text-field
                      label="ID User"
                      disabled
                      :model-value="userTopup._id"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field
                      label="Nama"
                      disabled
                      :model-value="userTopup.name"
                      ></v-text-field>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col cols="12">
                      <v-text-field
                      label="Nominal Top Up"
                      clearable
                      v-model="total"
                      :rules="rules"
                      ></v-text-field>
                  </v-col>
                  </v-row>
              </v-container>
              <small>*Lengkapi Data</small>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green-darken-4"
                  variant="text"
                  type="submit"
              >
                  Top Up
              </v-btn>
              <v-btn
                  color="green-darken-4"
                  variant="text"
                  @click="showTopup = false"
              >
                  Batal
              </v-btn>
          </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <v-card>
    <v-layout>
      <MenubarAdmin />
      <v-main style="min-height: 700px;">
        <v-container fluid>
          <v-form validate-on="submit lazy" @submit.prevent="cariUser()">
            <!-- <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="search"
                  label="Nama User"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-btn
                  width="100%"
                  height="100%"
                  color="green-darken-4"
                  variant="text"
                  type="submit"
                >
                  Cari
                </v-btn>
              </v-col>
            </v-row> -->
          </v-form>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">
                  ID
                </th>
                <th class="text-left">
                  Nama
                </th>
                <th class="text-left">
                  Saldo
                </th>
                <th class="text-left">
                  Koin
                </th>
                <th>
                  Top Up Saldo
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user._id"
              >
                <td>{{ user._id }}</td>
                <td>{{ user.name }}</td>
                <td>
                  {{ 
                    new Intl.NumberFormat("en-ID", {
                      style: "currency",
                      currency: "IDR"
                    }).format(user.saldo)
                  }}
                </td>
                <td>{{ user.poin }}</td>
                <td>
                  <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="openModal(user, true)"
                  >
                    Top Up
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
  import axios from '@/services/api'
  import Swal from 'sweetalert2';

  export default {
    data() {
      return {
        token: JSON.parse(localStorage.getItem("token")),
        users: {},
        userTopup: null,
        search: '',
        rules: [(value) => {
          if (value > 0) return true
          return "Mohon isi data!"
        }],
        showTopup: false,
        total: 0,
      }
    },
    components: {
      MenubarAdmin
    },
    methods: {
      async cariUser() {},
      async loadUser() {
        await axios.get('user/read', {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.users = res.data;
        })
      },
      async topup() {
        await axios.patch('topup/saldo/' + this.userTopup._id, {
          total: parseFloat(this.total)
        }, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.showTopup = false;
          let dt = res.data.topup;
          Swal.fire({
            customClass: {
              container: "my-swal"
            },
            title: "Success Top Up!",
            icon: "success",
            html: `
              <p>
                invoice : ${dt.invoice}<br/>
                ID      : ${dt.user._id}<br/>
                Name    : ${dt.user.name}<br/>
                Top Up  : ${dt.total}<br/>
                <hr/>
                Admin -- ${dt.admin._id} / ${dt.admin.name} --
              </p>
            `,
            confirmButtonText: "Check",
            showConfirmButton: true,
            showCancelButton: true
          }).then((result) => {
            if(result.isConfirmed) {
              router.push({ name: 'UserTopup' });
            } else if(result.isDismissed) {
              router.go();
            }
          })
        })
      },
      async openModal(user, show) {
        this.showTopup = show;
        this.userTopup = user;
      },
    },
    beforeMount() {
      if(!this.token) {
        router.push('/admin/login');
      }
    },
    mounted() {
      this.loadUser();
    }
  }
</script>