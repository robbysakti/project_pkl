<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row justify="center">
        <v-col md="4">
          <v-card>
            <v-card-title class="text-amber-darken-1 bg-green-darken-4">
              <span class="text-h5">Login Admin</span>
            </v-card-title>
            <v-form validate-on="submit lazy" @submit.prevent="submitLoginAdmin">
                <v-card-text>
                    <v-container>
                        <v-row>
                        <v-col cols="12">
                            <v-text-field
                            label="Username"
                            clearable
                            v-model="userName"
                            :rules="rules"
                            ></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row>
                        <v-col cols="12">
                            <v-text-field
                            label="Password"
                            type="password"
                            clearable
                            v-model="password"
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
                        Masuk
                    </v-btn>
                </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
<script>
  import axios from '@/services/api';
  import Swal from 'sweetalert2';
  import router from '@/router';

  export default {
    data() {
      return {
        rules: [(value) => {
          if (value) return true
          return 'Mohon isi data!'
        }],
        userName: null,
        password: null
      };
    },
    methods: {
      async submitLoginAdmin() {
        if(this.userName == null || this.password == null) {
          return
        }
        await axios.post("user/login", {
            userName: this.userName,
            password: this.password
        })
        .then(async (res) => {
          if(res.data.role != 'admin') {
            this.userName = null;
            this.password = null;
            Swal.fire('Restricted', 'This page for admin only', 'info');
            return
          }
          localStorage.setItem("token", JSON.stringify(res.data.token));
          await axios.get("/user/info", {
            headers : {
              Authorization : "Bearer " + res.data.token
            }
          })
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            router.push('/admin/produk');
          });
        })
      }
    }
}
</script>