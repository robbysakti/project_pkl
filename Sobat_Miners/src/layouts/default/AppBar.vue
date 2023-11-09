<template>
  <v-app-bar class="bg-green-lighten-3">
      <template v-slot:prepend><v-img src="/logo.png" style="width: 80px;"></v-img></template>
    <v-app-bar-title class="text-green-darken-4" style="font-size: 25px;">
      SOBAT MINERS
    </v-app-bar-title>
    <v-btn size="large" class=" text-green-darken-4" :to="{name: 'Home'}">Beranda</v-btn>
    <v-btn size="large" class=" text-green-darken-4" :to="{name:'KoinShop'}">Koin Shop</v-btn>
    <v-btn size="large" class="bg-amber-darken-1 text-green-darken-4" v-if="!token" @click="showLogin = true">Login</v-btn>
    <v-btn size="large" class="bg-amber-darken-1 text-green-darken-4" v-if="token" @click="logout()">Logout</v-btn>
  </v-app-bar>
  <v-row justify="center">
    <v-dialog
      v-model="showLogin"
      persistent
      class="w-50"
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">Login User</span>
        </v-card-title>
        <v-form validate-on="submit lazy" @submit.prevent="submitLogin">
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
                <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="showLogin = false"
                >
                    Batal
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  import axios from '@/services/api';

  export default {
    name: "login",
    data() {
        return {
            token: JSON.parse(localStorage.getItem("token")),
            showLogin: false,
            rules: [(value) => {
                if (value) return true

                return 'Mohon isi!'
            }],
            userName: null,
            password: null
        };
    },
    methods: {
        async submitLogin() {
            if(this.userName == null || this.password == null) {
                return
            }

            await axios.post("user/login", {
                userName: this.userName,
                password: this.password
            })
            .then(async (res) => {
                const user_info = await axios.get("/user/info", {
                    headers : {
                        Authorization : "Bearer " + res.data.token
                    }
                })
                localStorage.setItem("token", JSON.stringify(res.data.token));
                localStorage.setItem("user", JSON.stringify(user_info));
            })
            
            this.$router.go('/')
        },
        async logout() {
            await axios.post("user/logout", null, {
                headers: {
                    Authorization: "Bearer " + this.token
                }
            });
            localStorage.clear()

            this.$router.go('/')
        },
    }
}
</script>
