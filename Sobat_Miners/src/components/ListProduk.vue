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
                {{ data.produkPrice }}
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
                @click="pesan(data._id)"
              >
                Pesan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
  import axios from '@/services/api';

  export default {
    name: "produk-list",
    data() {
      return {
        token: JSON.parse(localStorage.getItem("token")),
        produk: {}
      };
    },
    methods: {
      async loadProduk() {
        const data = await axios.get('produk/read')
        this.produk = data
        console.log(this.produk)
      },
      async pesan(produk) {
        console.log(produk)
      }
    },
    beforeMount() {
      this.loadProduk();
    }
  }
</script>
