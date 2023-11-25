<template>
    <v-dialog
      v-model="showDetail"
      persistent
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">History Booking</span>
        </v-card-title>
          <v-card-text>
            <v-container>
                  <v-row>
                  <v-col cols="6">
                      <div>Invoice : {{ bookingDetail.invoice }}</div>
                  </v-col>
                  <v-col cols="6">
                      <div>Produk : {{ bookingDetail.produk.name }}</div>
                  </v-col>
                  </v-row>
                <v-row>
                    <v-col cols="12">
                        <div>Harga : {{ bookingDetail.produk.price }}</div>
                    </v-col>
                </v-row>
                  <v-row>
                  <v-col cols="6">
                    <div>Mulai : {{ new Date(bookingDetail.bookingStartDate).toLocaleString() }}</div>
                  </v-col>
                  <v-col cols="6">
                      <div>Selesai : {{ new Date(bookingDetail.bookingStartDate).toLocaleString() }}</div>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col cols="12">
                      <div>Total Harga : {{ bookingDetail.total }}</div>
                  </v-col>
                  </v-row>
                <hr/>
                <v-row>
                <v-col cols="6">
                    <div>{{ bookingDetail.status }}</div>
                </v-col>
                </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green-darken-4"
                  variant="text"
                  @click="hapusHistoryBooking(bookingDetail._id)"
              >
                  Hapus
              </v-btn>
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
            <br/>
            <v-btn width="50%" :to="{ name: 'Transaksi' }">Makanan & Minuman</v-btn>
            <v-btn width="50%" :to="{ name: 'Booking' }">Booking</v-btn>
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
                      Tanggal Booking
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
                  v-for="book in booking"
                  :key="book._id"
                >
                    <td>{{ book.invoice }}</td>
                    <td>{{ book.produk.name }}</td>
                    <td>{{ book.produk.price }}</td>
                    <td>{{ new Date(book.bookingStartDate).toLocaleString() }}</td>
                    <td>{{ book.total }}</td>
                  <td>
                    <v-btn
                      color="green-darken-4"
                      variant="text"
                      @click="openDetail(book, true)"
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
          customer: JSON.parse(localStorage.getItem("customer")),
          booking: [],
          showDetail: null,
          bookingDetail: null
        }
      },
      methods: {
        async loadAuth() {
            const data = await axios.get('user/read/'+ this.customer.data._id, {
            headers: {
                Authorization: 'Bearer ' + this.token
            }
            })
            .catch(() => {
            localStorage.removeItem('customer');
            localStorage.removeItem('token-customer');
            router.go();
            })
        },
        async loadBooking() {
          await axios.get('booking/read', {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then((res) => {
            res.data.forEach((dt) => {
              this.booking.push(dt);
            })
          })
        },
        async openDetail(data, show) {
          this.showDetail = show;
          this.bookingDetail = data;
        },
        async hapusHistoryBooking(id) {
          await axios.delete('booking/delete/' + id, {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then(() => {
            router.go();
          })
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
        if(this.customer || this.token) {
            this.loadAuth();
        }
        
        if(!this.token) {
          router.push('/');
        }
      },
      mounted() {
        this.loadBooking();
      }
    }
  </script>