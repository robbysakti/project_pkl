<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto" v-for="data in produk">
          <v-card
            class="mx-auto my-12"
            min-width="312"
            max-width="374"
          >
            <v-img
              cover
              height="250"
              :src="'http://localhost:3001/' + data.image[0].imageUrl"
            ></v-img>

            <v-card-item>
              <v-card-title>{{ data.produkName }}</v-card-title>

              <v-card-subtitle>
                <span class="me-1">{{ data.category.categoryName }}</span>

                <!-- <v-icon
                  color="error"
                  icon="mdi-fire-circle"
                  size="small"
                ></v-icon> -->
              </v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <div class="my-4 text-subtitle-1">
                {{ 
                  new Intl.NumberFormat("en-ID", {
                    style: "currency",
                    currency: "IDR"
                  }).format(data.produkPrice) 
                }}
              </div>

              <div>{{ data.description }}</div>
            </v-card-text>

            <v-divider class="mx-4 mb-1"></v-divider>

            <!-- <v-card-title>Tonight's availability</v-card-title> -->
            <v-card-actions>
              <v-btn
                v-if="token"
                color="green-darken-4"
                variant="text"
                @click="pesan(data._id, true)"
              >
                Pesan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>

  <v-dialog
    v-model="modalPesan"
    persistent
  >
    <v-card>
      <v-card-title class="text-amber-darken-1 bg-green-darken-4">
        <span class="text-h5">Pesan</span>
      </v-card-title>
      <v-form validate-on="submit lazy" @submit.prevent="tambahPesan()">
          <v-card-text>
              <v-container>
                  <v-row>
                    <v-col>
                      <v-card
                        class="mx-auto my-12"
                        min-width="312"
                        max-width="374"
                      >
                        <v-img
                          cover
                          height="250"
                          :src="'http://localhost:3001/' + AddChart.image[0].imageUrl"
                        ></v-img>

                        <v-card-item>
                          <v-card-title>{{ AddChart.produkName }}</v-card-title>

                          <v-card-subtitle>
                            <span class="me-1">{{ AddChart.category.categoryName }}</span>
                          </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                          <div class="my-4 text-subtitle-1">
                            {{ 
                              new Intl.NumberFormat("en-ID", {
                                style: "currency",
                                currency: "IDR"
                              }).format(AddChart.produkPrice) 
                            }}
                          </div>

                          <div>{{ AddChart.description }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                      label="Jumlah Pesanan"
                      clearable
                      v-model="jumlah"
                      :rules="rules"
                      ></v-text-field>
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
                  Pesan
              </v-btn>
              <v-btn
                  color="green-darken-4"
                  variant="text"
                  @click="modalPesan = false"
              >
                  Batal
              </v-btn>
          </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from '@/services/api';

  export default {
    name: "produk-list",
    data() {
      return {
        token: JSON.parse(localStorage.getItem("token-customer")),
        rules: [(value) => {
          if (value) return true
          return "Mohon isi data!"
        }],
        produk: {},
        modalPesan: false,
        modalBooking: false,
        AddChart: {},
        jumlah: 1
      };
    },
    methods: {
      async loadProduk() {
        const data = await axios.get('produk/read')
        this.produk = data.data
      },
      async pesan(produk, show) {
        this.modalPesan = show;
        this.AddChart = produk;
      },
      async tambahPesan() {
        await axios.post('transaksi/create', {
          produkId : this.AddChart._id,
          jumlah : parseInt(this.jumlah)
        })
        .then((res) => {
          this.modalPesan = false;
          let dt = res.data.transaksi;
          Swal.fire({
            customClass: {
              container: "my-swal"
            },
            title: "Berhasil ditambah ke keranjang!",
            icon: "success",
            html: `
              <p>
                invoice         : ${dt.invoice}<br/>
                Produk          : ${dt.produk.name}<br/>
                Harga           : ${dt.produk.price}<br/>
                Jumlah Pesanan  : ${dt.jumlah}<br/>
                <hr/>
                Total Harga     : ${dt.total}<br/>
              </p>
            `
          })
        })
      },
      // async tambahBooking() {
      //   await axios.post('booking/create', {
      //     produkId : this.AddChart._id,
      //     jumlah : parseInt(this.jumlah)
      //   })
      //   .then((res) => {
      //     this.modalBooking = false;
      //     let dt = res.data.booking;
      //     Swal.fire({
      //       customClass: {
      //         container: "my-swal"
      //       },
      //       title: "Berhasil ditambah ke keranjang!",
      //       icon: "success",
      //       html: `
      //         <p>
      //           invoice         : ${dt.invoice}<br/>
      //           Produk          : ${dt.produk.name}<br/>
      //           Harga           : ${dt.produk.price}<br/>
      //           Jumlah Pesanan  : ${dt.jumlah}<br/>
      //           <hr/>
      //           Total Harga     : ${dt.total}<br/>
      //         </p>
      //       `
      //     })
      //   })
      // }
    },
    beforeMount() {
      this.loadProduk();
    }
  }
</script>
