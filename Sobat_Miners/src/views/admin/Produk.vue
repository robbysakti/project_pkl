<template>      
  <!-- <v-row justify="center"> -->
    <v-dialog
      v-model="showBaru"
      persistent
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">Login User</span>
        </v-card-title>
        <v-form validate-on="submit lazy" @submit.prevent="newProduk()">
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="12">
                        <v-text-field
                        label="Nama Produk"
                        clearable
                        v-model="produkName"
                        :rules="rules"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="6">
                        <v-text-field
                        label="Harga Produk"
                        clearable
                        v-model="produkPrice"
                        :rules="rules"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        label="Kategori"
                        v-model="category"
                        :rules="rules"
                        :items="pilihanCateg"
                        item-title="categoryName"
                        item-value="_id"
                      ></v-select>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="12">
                        <v-textarea
                        label="Deskripsi"
                        clearable
                        v-model="description"
                        :rules="rules"
                        ></v-textarea>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="12">
                        <v-text-field
                        label="Gambar"
                        type="file"
                        clearable
                        v-model="image"
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
                    @click="showBaru = false"
                >
                    Batal
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  <!-- </v-row> -->
  <v-card>
    <v-layout>
      <MenubarAdmin />
      <v-main style="min-height: 700px;">
        <v-container fluid>
          <v-btn
            color="green-darken-4"
            variant="text"
            @click="showBaru = true"
          >
            Baru
          </v-btn>
          <v-table
            fixed-header
          >
            <thead>
              <tr>
                <th class="text-left">
                  Produk
                </th>
                <th class="text-left">
                  Harga
                </th>
                <th class="text-left">
                  Deskripsi
                </th>
                <th class="text-left">
                  Category
                </th>
                <th class="text-left">
                  Gambar
                </th>
                <th>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in produk"
                :key="item._id"
              >
                <td>{{ item.produkName }}</td>
                <td>{{ 
                  new Intl.NumberFormat("en-ID", {
                    style: "currency",
                    currency: "IDR"
                  }).format(item.produkPrice)
                }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.category.categoryName }}</td>
                <td>{{ item.image[0].imageUrl }}</td>
                <td>
                  <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="editProduk(item._id)"
                  >
                    Edit
                  </v-btn>
                  <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="delProduk(item._id)"
                  >
                    Hapus
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
  import MenubarAdmin from '@/components/MenubarAdmin.vue';
  import router from '@/router';
  import axios from '@/services/api'
  // import Swal from 'sweetalert2';

    export default {
        data() {
            return {
                token: JSON.parse(localStorage.getItem("token")),
                produk: {},
                pilihanCateg: [],
                rules: [(value) => {
                  if (value) return true
                  return "Mohon isi data!"
                }],
                showBaru: false,
                showEdit: false,
                produkName: null,
                produkPrice: null,
                description: null,
                category: null,
                image: null

            }
        },
        components: {
            MenubarAdmin
        },
        methods: {
            async loadProduk() {
                const data = await axios.get('produk/read')
                this.produk = data.data
            },
            async loadCategory() {
                await axios.get('category/read', {
                  headers: {
                    Authorization: 'Bearer ' + this.token
                  }
                })
                .then((res) => {
                  res.data.forEach(categ => {
                    this.pilihanCateg.push(categ)
                  });
                })
                .catch(err => {
                  localStorage.clear()
                  console.log(err)
                })
            },
            async newProduk() {
                await axios.post('produk/create', {
                  produkName: this.produkName,
                  produkPrice: this.produkPrice,
                  description: this.description,
                  category: this.category,
                  image: this.image
                }, {
                  headers: {
                    Authorization: 'Bearer ' + this.token
                  }
                })
            },
            async editProduk(idProd) {
                await axios.patch('produk/update/' + idProd, {
                  produkName: this.produkName,
                  produkPrice: this.produkPrice,
                  description: this.description,
                  category: this.category
                }, {
                  headers: {
                    Authorization: 'Bearer ' + this.token
                  }
                })
            },
            async delProduk(idProd) {
                await axios.delete('produk/update/' + idProd, {
                  headers: {
                    Authorization: 'Bearer ' + this.token
                  }
                })
            },
        },
        beforeMount() {
          if(!this.token) {
              router.push('/admin/login');
          }
          this.loadProduk();
          this.loadCategory();
        }
    }
</script>