<template>
  <v-card>
    <v-layout>
      <MenubarAdmin />
      <v-main style="min-height: 700px;">
        <v-container fluid>
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
                <td>{{ item.produkPrice }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.image }}</td>
                <td></td>
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
                produk: {}
            }
        },
        components: {
            MenubarAdmin
        },
        methods: {
            async loadProduk() {
                const data = await axios.get('produk/read')
                this.produk = data
                console.log(this.produk)
            },
        },
        beforeMount() {
            if(!this.token) {
                router.push('/admin/login');
            }

            this.loadProduk();
        }
    }
</script>