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
                @click="pesan(data, data.category.categoryName, true)"
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
  <v-dialog
    v-model="modalBooking"
    persistent
  >
    <v-card>
      <v-card-title class="text-amber-darken-1 bg-green-darken-4">
        <span class="text-h5">Pesan</span>
      </v-card-title>
      <v-form validate-on="submit lazy" @submit.prevent="tambahBooking()">
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
                    <v-col cols="6">
                      <VueDatePicker v-model="startBook"></VueDatePicker>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                      label="Lama booking per jam"
                      clearable
                      v-model="perJam"
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
                  @click="modalBooking = false"
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
  import Swal from 'sweetalert2';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';

  export default {
    name: "produk-list",
    data() {
      return {
        token: JSON.parse(localStorage.getItem("token-customer")),
        customer: JSON.parse(localStorage.getItem("customer")),
        rules: [(value) => {
          if (value) return true
          return "Mohon isi data!"
        }],
        produk: {},
        modalPesan: false,
        modalBooking: false,
        AddChart: {},
        jumlah: 1,
        startBook: null,
        perJam: null
      };
    },
    components: {
      VueDatePicker
    },
    methods: {
      async loadProduk() {
        const data = await axios.get('produk/read')
        this.produk = data.data
      },
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
      async pesan(produk, kategori, show) {
        const filter = kategori.toLowerCase();
        if (filter == "makanan" || filter == "minuman") {
          this.modalPesan = show;
          this.AddChart = produk;
        } else {
          this.modalBooking = show;
          this.AddChart = produk;
        }
      },
      async tambahPesan() {
        await axios.post('transaksi/create', {
          produkId : this.AddChart._id,
          jumlah : parseInt(this.jumlah)
        }, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
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
      async tambahBooking() {
        await axios.post('booking/create', {
          produkId : this.AddChart._id,
          bookingStartDate : this.startBook,
          jumlah : parseInt(this.perJam)
        }, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.modalBooking = false;
          let dt = res.data.booking;
          let wkt = res.data.waktu;
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
                Jumlah Pesanan  : ${wkt.start} - ${wkt.end}<br/>
                <hr/>
                Total Harga     : ${dt.total}<br/>
              </p>
            `
          })
        })
      }
    },
    beforeMount() {
      if(this.customer || this.token) {
        this.loadAuth();
      }
      this.loadProduk();
    }
  }
</script>
