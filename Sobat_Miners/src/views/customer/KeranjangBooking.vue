<template>
    <v-dialog
      v-model="showDetail"
      persistent
    >
      <v-card>
        <!-- <v-form validate-on="submit lazy" @submit.prevent="editSubmit(cBookDetail._id)"> -->
          <v-card-title class="text-amber-darken-1 bg-green-darken-4">
            <span class="text-h5">Checkout Booking</span>
          </v-card-title>
            <v-card-text>
              <v-container>
                  <v-row>
                  <v-col cols="6">
                      <div>Invoice : {{ cBookDetail.invoice }}</div>
                  </v-col>
                  <v-col cols="6">
                      <div>Produk : {{ cBookDetail.produk.name }}</div>
                  </v-col>
                  </v-row>
                <v-row>
                    <v-col cols="12">
                        <div>Harga : {{ cBookDetail.produk.price }}</div>
                    </v-col>
                </v-row>
                  <v-row>
                  <v-col cols="6">
                    <!-- <VueDatePicker 
                        v-model="editStartDate" 
                        :model-value="cBookDetail.bookingStartDate"
                    ></VueDatePicker> -->
                    <div>Mulai : {{ new Date(cBookDetail.bookingStartDate).toLocaleString() }}</div>
                  </v-col>
                  <v-col cols="6">
                      <div>Selesai : {{ new Date(cBookDetail.bookingEndDate).toLocaleString() }}</div>
                  </v-col>
                  <!-- <v-col cols="4">
                    <v-text-field
                      label="Lama / Jam"
                      clearable
                      v-model="editPerJam"
                      :model-value="cBookDetail.jumlah"
                      @update:model-value="cBookDetail.jumlah = $event"
                    ></v-text-field>
                  </v-col> -->
                  </v-row>
                  <v-row>
                  <v-col cols="12">
                      <div>Total Harga : {{ cBookDetail.total }}</div>
                  </v-col>
                  </v-row>
                  <hr/>
                  <v-row>
                  <v-col cols="6">
                      <div>{{ cBookDetail.status }}</div>
                  </v-col>
                  </v-row>
              </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn
              color="green-darken-4"
              variant="text"
              type="submit"
            >
              Edit
            </v-btn> -->
            <v-btn
              color="green-darken-4"
              variant="text"
              @click="showDetail = false"
            >
              OK
            </v-btn>
          </v-card-actions>
        <!-- </v-form> -->
      </v-card>
    </v-dialog>
    <v-card>
      <v-form validate-on="submit lazy" @submit.prevent="checkoutSubmit()">
        <v-layout>
          <v-main style="min-height: 700px;">
            <v-container fluid>
              <br/>
              <v-btn width="50%" :to="{ name: 'CartTransaksi' }">Makanan & Minuman</v-btn>
              <v-btn width="50%" :to="{ name: 'CartBooking' }">Booking</v-btn>
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
                    v-for="booking in cBooking"
                    :key="booking._id"
                  >
                    <td>{{ booking.invoice }}</td>
                    <td>{{ booking.produk.name }}</td>
                    <td>
                      {{ 
                        new Intl.NumberFormat("en-ID", {
                          style: "currency",
                          currency: "IDR"
                        }).format(booking.produk.price)
                      }}
                    </td>
                    <td>{{ new Date(booking.bookingStartDate).toLocaleString() }}</td>
                    <td>
                      {{ 
                        new Intl.NumberFormat("en-ID", {
                          style: "currency",
                          currency: "IDR"
                        }).format(booking.total)
                      }}
                    </td>
                    <td>
                      <v-btn
                        color="green-darken-4"
                        variant="text"
                        @click="openDetail(booking, true)"
                      >
                        Lihat
                      </v-btn>
                      <v-btn
                        color="green-darken-4"
                        variant="text"
                        @click="openHapus(booking)"
                      >
                        Hapus
                      </v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td rowspan="6" >
                      Total Checkout : 
                      {{ 
                        new Intl.NumberFormat("en-ID", {
                          style: "currency",
                          currency: "IDR"
                        }).format(totCheck)
                      }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-main>
        </v-layout>
        <v-card-actions>
          <hr/>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-4"
            variant="text"
            type="submit"
          >
            Checkout
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
</template>
<script>
    import router from '@/router';
    import axios from '@/services/api';
    import Swal from 'sweetalert2';
    // import VueDatePicker from '@vuepic/vue-datepicker';
    // import '@vuepic/vue-datepicker/dist/main.css';

    export default {
    data() {
        return {
        token: JSON.parse(localStorage.getItem("token-customer")),
        customer: JSON.parse(localStorage.getItem("customer")),
        cBooking: {},
        showDetail: null,
        cBookDetail: null,
        totCheck: 0
        // editPerJam: 0,
        // editStartDate: null
        }
    },
    // components: {
    //   VueDatePicker
    // },
    methods: {
        async loadAuth() {
          await axios.get('user/read/'+ this.customer.data._id, {
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
        async loadChartBooking() {
            await axios.get('booking/read_checkout', {
                headers: {
                Authorization: 'Bearer ' + this.token
                }
            })
            .then((res) => {
                this.cBooking = res.data;
                Object.keys(this.cBooking).forEach((key) => {
                  this.totCheck += this.cBooking[key].total
                })
            })
        },
        async openDetail(data, show) {
            this.showDetail = show;
            this.cBookDetail = data;
        },
        // async editSubmit(idBooking) {
        //     this.editBooking(idBooking);
        // },
        // async editBooking(idBooking) {
        //     await axios.patch('booking/update/' + idBooking, {
        //         jumlah: parseInt(this.editPerJam),
        //         bookingStartDate: this.editStartDate
        //     }, {
        //         headers: {
        //         Authorization: 'Bearer ' + this.token
        //         }
        //     })
        //     .then(() => {
        //         router.go();
        //     })
        // },
        async checkoutSubmit() {
            await axios.put('booking/checkout', {
                id: this.customer.data._id
            }, {
                headers: {
                Authorization: 'Bearer ' + this.token
                }
            })
            .then((res) => {
                // let dt = Array.from(res.data.booking);
                Swal.fire({
                customClass: {
                    container: "my-swal"
                },
                title: "Success Checkout!",
                icon: "success",
                html: `
                    ${
                    //   dt.forEach((data) => {
                    //     `<p>
                    //         invoice         : ${data.invoice}<br/>
                    //         Produk          : ${data.produk.name}<br/>
                    //         Harga           : ${data.produk.price}<br/>
                    //         Lama/jam        : ${data.jumlah}<br/>
                    //         <hr/>
                    //         Mulai           : ${data.bookingStartDate}<br/>
                    //         Selesai         : ${data.bookingEndDate}<br/>
                    //         <hr/>
                    //         Harga           : ${data.total}<br/>
                    //     </p>`
                    // })
                    `<p>
                      Total Checkout  : ${
                          new Intl.NumberFormat("en-ID", {
                          style: "currency",
                          currency: "IDR"
                        }).format(res.data.total)
                      }
                    </p>`
                    }
                `,
                }).then((result) => {
                  if(result.isConfirmed) {
                    router.go();
                  }
                })
            })
        },
        async openHapus(dt) {
            Swal.fire({
                customClass: {
                container: "my-swal"
                },
                title: "Hapus dari keranjang ?",
                icon: "warning",
                html: 
                `<p>
                    invoice         : ${dt.invoice}<br/>
                    Produk          : ${dt.produk.name}<br/>
                    Harga           : ${dt.produk.price}<br/>
                    Lama/jam        : ${dt.jumlah}<br/>
                    <hr/>
                    Mulai           : ${dt.bookingStartDate}<br/>
                    Selesai         : ${dt.bookingEndDate}<br/>
                    <hr/>
                    Harga           : ${dt.total}<br/>
                </p>`,
                cancelButtonText: "Cancel",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Hapus"
            }).then(async(result) => {
                if (result.isConfirmed) {
                    await axios.delete('booking/delete/' + dt._id, {
                        headers: {
                        Authorization: 'Bearer ' + this.token
                        }
                    })
                    .then(() => {
                        router.go();
                    })
                }else if (result.isDismissed) {
                    router.go();
                }
            })
        }
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
        this.loadChartBooking();
    }
    }
</script>