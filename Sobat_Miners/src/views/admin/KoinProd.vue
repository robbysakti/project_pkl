<template>
    <v-dialog
      v-model="showBaru"
      persistent
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">Produk Koin Shop</span>
        </v-card-title>
        <v-form validate-on="submit lazy" @submit.prevent="baruSubmit()">
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="12">
                        <v-text-field
                        label="Nama Produk"
                        clearable
                        v-model="koinProdName"
                        :rules="rules"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="6">
                        <v-text-field
                        label="Harga Produk"
                        clearable
                        v-model="koinProdPrice"
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
                        ></v-textarea>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="12">
                      <v-file-input 
                        label="File Gambar"
                        clearable
                        variant="solo-filled"
                        v-model="image"
                        :rules="rules"
                        >
                      </v-file-input>
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
                    Tambah
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
    <v-dialog
      v-model="showEdit"
      persistent
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">Edit Produk {{ editProd.koinProdName }}</span>
        </v-card-title>
        <v-form validate-on="submit lazy" @submit.prevent="editSubmit(editProd._id)">
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="12">
                        <v-text-field
                        label="Nama Produk"
                        clearable
                        v-model="koinProdName"
                        :model-value="editProd.koinProdName"
                        @update:model-value="editProd.koinProdName = $event"
                        :rules="rules"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="6">
                        <v-text-field
                        label="Harga Produk"
                        clearable
                        v-model="koinProdPrice"
                        :model-value="editProd.koinProdPrice"
                        @update:model-value="editProd.koinProdPrice = $event"
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
                        :model-value="editProd.category._id"
                        @update:model-value="editProd.category._id = $event"
                      ></v-select>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="12">
                        <v-textarea
                        label="Deskripsi"
                        clearable
                        v-model="description"
                        :model-value="editProd.description"
                        @update:model-value="editProd.description = $event"
                        ></v-textarea>
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
                    Edit
                </v-btn>
                <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="showEdit = false"
                >
                    Batal
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
                    Koin
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
                  v-for="item in koinProd"
                  :key="item._id"
                >
                  <td>{{ item.koinProdName.toUpperCase() }}</td>
                  <td>
                    {{ item.koinProdPrice }}
                  </td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.category.categoryName }}</td>
                  <td>
                    <v-btn
                      color="green-darken-4"
                      variant="text"
                      @click="openGambar(item, true)"
                    >
                    View Gambar
                    </v-btn>
                  </td>
                  <td>
                    <v-btn
                      color="green-darken-4"
                      variant="text"
                      @click="openEditModal(item, true)"
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
    <v-dialog
      v-model="showImage"
      persistent
    >
      <v-card>
        <v-card-title class="text-amber-darken-1 bg-green-darken-4">
          <span class="text-h5">Gambar Produk {{ editProd.koinProdName }}</span>
        </v-card-title>
        <v-form validate-on="submit lazy" @submit.prevent="">
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="4" v-for="image in editProd.image">
                      <v-img
                        :width="300"
                        aspect-ratio="16/9"
                        cover
                        :src="`http://localhost:3001/${image.imageUrl}`"
                      ></v-img>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="12">
                      <v-file-input 
                        label="File Gambar"
                        clearable
                        variant="solo-filled"
                        v-model="image"
                        :rules="rules"
                        >
                      </v-file-input>
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
                    Tambah
                </v-btn>
                <v-btn
                    color="green-darken-4"
                    variant="text"
                    @click="showImage = false"
                >
                    Keluar
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
                  koinProd: {},
                  pilihanCateg: [],
                  editProd: null,
                  rules: [(value) => {
                    if (value) return true
                    return "Mohon isi data!"
                  }],
                  showBaru: false,
                  showEdit: false,
                  showImage: false,
                  koinProdName: null,
                  koinProdPrice: null,
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
                  await axios.get('koin_produk/read')
                  .then((res) => {
                    this.koinProd = res.data
                  })
                  .catch(err => {
                    if(err.response.status === 404 || err.response.status === 400) {
                      return;
                    }
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                  })
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
                  .catch((err) => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                  })
              },
              async baruSubmit() {
                const params = new FormData()
                params.append("koinProdName", this.koinProdName)
                params.append("koinProdPrice", this.koinProdPrice)
                params.append("description", this.description)
                params.append("category", this.category)
  
                if(this.image.length !== 0) {
                    for(let i = 0; i < this.image.length; i++) {
                      params.append("image", this.image[i]);
                    }
                }
                
                this.newProduk(params);
              },
              async newProduk(params) {
                  await axios.post('koin_produk/create', params, {
                    headers: {
                      Authorization: 'Bearer ' + this.token
                    }
                  })
                  .then((res) => {
                    router.go('/');
                  })
              },
              async openEditModal(prod, show) {
                this.showEdit = show;
                this.editProd = prod;
  
                this.koinProdName = this.editProd.koinProdName;
                this.koinProdPrice = this.editProd.koinProdPrice;
                this.description = this.editProd.description;
                this.category = this.editProd.category._id;
              },
              async openGambar(prod, show) {
                this.showImage = show;
  
                this.editProd = prod;
              },
              async editSubmit(idProd) {
                this.editProduk(idProd);
              },
              async editProduk(idProd) {
                  await axios.patch('koin_produk/update/' + idProd, {
                    koinProdName: this.koinProdName,
                    koinProdPrice: this.koinProdPrice,
                    description: this.description,
                    category: this.category
                  }, {
                    headers: {
                      Authorization: 'Bearer ' + this.token
                    }
                  })
                  .then(() => {
                    router.go('/');
                  })
              },
              async delProduk(idProd) {
                  await axios.delete('koin_produk/delete/' + idProd, {
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
                router.push('/admin/login');
            }
          },
          mounted() {
            // setTimeout(() => {this.loadProduk();}, 2000)
            this.loadProduk()
            
            this.loadCategory();
          },
      }
  </script>