<template>
  <v-dialog
    v-model="showDetail"
    persistent
  >
    <v-card>
      <v-form validate-on="submit lazy" @submit.prevent="editSubmit(cTransDetail._id)">
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">Checkout Transaksi</span>
        </v-card-title>
          <v-card-text>
            <v-container>
                <v-row>
                <v-col cols="6">
                    <div>Invoice : {{ cTransDetail.invoice }}</div>
                </v-col>
                <v-col cols="6">
                    <div>Produk : {{ cTransDetail.produk.name }}</div>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="6">
                    <div>Harga : {{ cTransDetail.produk.price }}</div>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Jumlah"
                    clearable
                    v-model="editJumlah"
                    :model-value="cTransDetail.jumlah"
                    @update:model-value="cTransDetail.jumlah = $event"
                  ></v-text-field>
                </v-col>
                </v-row>
                <v-row>
                <v-col cols="12">
                    <div>Total Harga : {{ cTransDetail.total }}</div>
                </v-col>
                </v-row>
                <hr/>
                <v-row>
                <v-col cols="6">
                    <div>{{ cTransDetail.status }}</div>
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
          <v-btn
            color="green-darken-4"
            variant="text"
            @click="showDetail = false"
          >
            Batal
          </v-btn>
        </v-card-actions>
      </v-form>
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
                  v-for="transaksi in cTransaksi"
                  :key="transaksi._id"
                >
                  <td>{{ transaksi.invoice }}</td>
                  <td>{{ transaksi.produk.name }}</td>
                  <td>
                    {{ 
                      new Intl.NumberFormat("en-ID", {
                        style: "currency",
                        currency: "IDR"
                      }).format(transaksi.produk.price)
                    }}
                  </td>
                  <td>{{ transaksi.jumlah }}</td>
                  <td>
                    {{ 
                      new Intl.NumberFormat("en-ID", {
                        style: "currency",
                        currency: "IDR"
                      }).format(transaksi.total)
                    }}
                  </td>
                  <td>
                    <v-btn
                      color="green-darken-4"
                      variant="text"
                      @click="openDetail(transaksi, true)"
                    >
                      Lihat
                    </v-btn>
                    <v-btn
                      color="green-darken-4"
                      variant="text"
                      @click="openHapus(transaksi)"
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
      <hr/>
      <v-card-actions>
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
  
    export default {
      data() {
        return {
          token: JSON.parse(localStorage.getItem("token-customer")),
          customer: JSON.parse(localStorage.getItem("customer")),
          cTransaksi: {},
          totCheck: 0,
          showDetail: null,
          cTransDetail: null,
          editJumlah: 0
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
        async loadChartTransaksi() {
          await axios.get('transaksi/read_checkout', {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then((res) => {
            this.cTransaksi = res.data;
            Object.keys(this.cTransaksi).forEach((key) => {
             this.totCheck += this.cTransaksi[key].total
            })
          })
        },
        async openDetail(data, show) {
          this.showDetail = show;
          this.cTransDetail = data;
        },
        async editSubmit(idTransaksi) {
          this.editTransaksi(idTransaksi);
        },
        async editTransaksi(idTransaksi) {
          await axios.patch('transaksi/update/' + idTransaksi, {
            jumlah: parseInt(this.editJumlah)
          }, {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then(() => {
            router.go();
          })
        },
        async checkoutSubmit() {
          await axios.put('transaksi/checkout', {
            id: this.customer.data._id
          }, {
            headers: {
              Authorization: 'Bearer ' + this.token
            }
          })
          .then((res) => {
            // let dt = res.data.transaksi;
            Swal.fire({
              customClass: {
                container: "my-swal"
              },
              title: "Success Checkout!",
              icon: "success",
              html: `
                ${
                  // dt.forEach((data) => {
                  // `<p>
                  //   invoice         : ${data.invoice}<br/>
                  //   Produk          : ${data.produk.name}<br/>
                  //   Harga           : ${data.produk.price}<br/>
                  //   Jumlah Pesanan  : ${data.jumlah}<br/>
                  //   <hr/>
                  //   Total Harga     : ${data.total}<br/>
                  // </p>`
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
            html: `
              <p>
                invoice         : ${dt.invoice}<br/>
                Produk          : ${dt.produk.name}<br/>
                Harga           : ${dt.produk.price}<br/>
                Jumlah Pesanan  : ${dt.jumlah}<br/>
                <hr/>
                Total Harga     : ${dt.total}<br/>
              </p>
            `,
            cancelButtonText: "Cancel",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Hapus"
          }).then(async(result) => {
            if (result.isConfirmed) {
              await axios.delete('transaksi/delete/' + dt._id, {
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
        this.loadChartTransaksi();
      }
    }
  </script>