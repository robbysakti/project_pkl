<template>
    <v-dialog
      v-model="showDetail"
      persistent
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">History Transaksi</span>
        </v-card-title>
          <v-card-text>
            <v-container v-for="transaksi in transaksi">
                <v-row>
                <v-col cols="6">
                    <div>{{ transaksi.invoice }}</div>
                </v-col>
                <v-col cols="6">
                    <div>{{ transaksi.produk.name }}</div>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="6">
                    <div>{{ transaksi.produk.price }}</div>
                </v-col>
                <v-col cols="6">
                    <div>Jumlah : {{ transaksi.jumlah }}</div>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="12">
                    <div>{{ transaksi.total }}</div>
                </v-col>
                </v-row>
                <hr/>
                <v-row>
                <v-col cols="6">
                    <div>{{ transaksi.status }}</div>
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
                    Produk
                  </th>
                  <th class="text-left">
                    Harga
                  </th>
                  <th class="text-left">
                    Jumlah
                  </th>
                  <th class="text-left">
                    Total Harga
                  </th>
                  <th class="text-left">
                    Check
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="trans in transaksi"
                  :key="trans._id"
                >
                  <td>{{ trans.invoice }}</td>
                  <td>{{ trans.produk.name }}</td>
                  <td>{{ trans.produk.price }}</td>
                  <td>{{ trans.jumlah }}</td>
                  <td>{{ trans.total }}</td>
                  <td>
                    <v-btn
                      color="green-darken-4"
                      variant="text"
                      @click="openDetail(trans, true)"
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
    import router from '@/router';
    import axios from '@/services/api';
  
    export default {
      data() {
        return {
          token: JSON.parse(localStorage.getItem("token-customer")),
          transaksi: [],
          showDetail: null,
          transaksiDetail: null
        }
      },
      methods: {
        async loadTransaksi() {
          await axios.get('transaksi/read', {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then((res) => {
            res.data.forEach((dt) => {
              this.transaksi.push(dt);
            })
          })
        },
        async openDetail(data, show) {
          this.showDetail = show;
          this.transaksiDetail = data;
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
          router.push('');
        }
      },
      mounted() {
        this.loadTransaksi();
      }
    }
  </script>