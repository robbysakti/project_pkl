<template>
    <v-container fluid>
    <v-card>
    <v-card-title class="text-amber-darken-1 bg-green-darken-4">
        <span class="text-h5">Data {{ customer.data.name }}</span>
    </v-card-title>
    <v-form validate-on="submit lazy" @submit.prevent="editUser()">
        <v-card-text>
            <v-container>
                <v-row>
                <v-col cols="12">
                    <v-text-field
                    label="Username"
                    clearable
                    v-model="userName"
                    @update:model-value="customer.data.userName = $event"
                    :rules="rules"
                    ></v-text-field>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="12">
                    <v-text-field
                    label="Nama"
                    clearable
                    v-model="name"
                    @update:model-value="customer.data.name = $event"
                    :rules="rules"
                    ></v-text-field>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="1"> Saldo : </v-col>
                <v-col cols="11">
                    <div>
                        {{ 
                            new Intl.NumberFormat("en-ID", {
                            style: "currency",
                            currency: "IDR"
                            }).format(customer.data.saldo)
                        }}
                    </div>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="1"> Koin : </v-col>
                <v-col cols="11">
                    <div>{{ customer.data.poin }}</div>
                </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green-darken-4"
                variant="text"
                type="submit"
            >
                Edit
            </v-btn>
        </v-card-actions>
    </v-form>
    </v-card>
</v-container>
  </template>
  <script>
    import router from '@/router';
    import axios from '@/services/api'
  
    export default {
      data() {
        return {
          token: JSON.parse(localStorage.getItem("token-customer")),
          customer: JSON.parse(localStorage.getItem("customer")),
          userName: '',
          name: '',
        //   password: null,
        //   passwordConfirm: null,
          rules: [(value) => {
            if (value) return true
            return "Mohon isi data!"
          }],
        }
      },
      methods: {
        async loadUser() {
          await axios.get('user/read/' + this.customer.data._id, {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then((res) => {
            this.name = res.data.name;
            this.userName = res.data.userName;
          })
        },
        async editUser() {
          await axios.patch('user/update/' + this.customer.data._id, {
            userName : this.userName, 
            name : this.name, 
            // password : this.password, 
            // passwordConfirm : this.passwordConfirm
          }, {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then(() => {
            router.go();
          })
        },
      },
      beforeMount() {
        if(!this.token) {
          router.push('/');
        }
      },
      mounted() {
        this.loadUser()
      }
    }
  </script>