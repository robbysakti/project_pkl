<template>
  <v-dialog
    v-model="showBaru"
    persistent
  >
    <v-card>
      <v-card-title class="text-amber-darken-1 bg-green-darken-4">
        <span class="text-h5">Tambah Kategori</span>
      </v-card-title>
      <v-form validate-on="submit lazy" @submit.prevent="addCategory()">
          <v-card-text>
              <v-container>
                  <v-row>
                  <v-col cols="12">
                    <v-text-field
                    label="Nama Kategori"
                    clearable
                    v-model="category"
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
        <span class="text-h5">Edit Kategori {{ editCateg._id }}</span>
      </v-card-title>
      <v-form validate-on="submit lazy" @submit.prevent="editCategory(editCateg._id)">
          <v-card-text>
              <v-container>
                  <v-row>
                  <v-col cols="12">
                    <v-text-field
                    label="Nama Kategori"
                    clearable
                    v-model="category"
                    :model-value="editCateg.categoryName"
                    @update:model-value="editCateg.categoryName = $event"
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
                  Kode
                </th>
                <th class="text-left">
                  Kategori
                </th>
                <th>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in Categ"
                :key="item._id"
              >
                <td>{{ item._id }}</td>
                <td>{{ item.categoryName }}</td>
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
                    @click="delCateg(item._id)"
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

  export default {
    data() {
      return {
        token: JSON.parse(localStorage.getItem("token")),
        Categ: {},
        rules: [(value) => {
          if (value) return true
          return "Mohon isi data!"
        }],
        showBaru: false,
        showEdit: false,
        editCateg: null,
        category: null,
      }
    },
    components: {
      MenubarAdmin
    },
    methods: {
      async loadCategory() {
        await axios.get('category/read', {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then((res) => {
          this.Categ = res.data;
        })
      },
      async addCategory() {
        await axios.post('category/create', {
          categoryName: this.category
        }, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then(() => {
          router.go();
        })
      },
      async openEditModal(categ, show) {
        this.showEdit = show;
        this.editCateg = categ;

        this.category = this.editCateg.categoryName;
      },
      async editCategory(idCateg) {
        await axios.patch('category/update/' + idCateg, {
          categoryName: this.category
        }, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then(() => {
          router.go();
        })
      },
      async delCateg(idCateg) {
        await axios.delete('category/delete/' + idCateg, {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        })
        .then(() => {
          router.go('/');
        })
      },
    },
    beforeMount() {
      if(!this.token) {
        router.push('/admin/login');
      }
    },
    mounted() {
      this.loadCategory();
    }
  }
</script>