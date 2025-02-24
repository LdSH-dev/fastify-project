<template>
  <v-container>
    <v-alert
        v-model="showErrorAlert"
        type="error"
        dismissible
        transition="scale-transition"
        class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>

    <v-row>
      <v-col cols="12" style="margin-top: 3rem">
        <v-subheader style="color:white; font-weight: bold;" class="text-h3">Lista de Produtos</v-subheader>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between">
      <v-col cols="8">
        <v-text-field
            v-model="searchQuery"
            label="Pesquisar produtos"
            append-icon="mdi-magnify"
            solo
            class="custom-text-field"
        ></v-text-field>
      </v-col>

      <v-col cols="auto">
        <v-icon color="primary" @click="openCreateModal">mdi-plus</v-icon>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
            :headers="headers"
            :items="filteredProducts"
            item-key="product_id"
            class="elevation-1"
        >
          <template v-slot:[`item.name`]="{ item }">
            <td>{{ item.name }}</td>
          </template>
          <template v-slot:[`item.price`]="{ item }">
            <td>{{ formatCurrency(item.price) }}</td>
          </template>
          <template v-slot:[`item.updatedAt`]="{ item }">
            <td>{{ formatDate(item.updatedAt) }}</td>
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">
            <td>{{ formatDate(item.createdAt) }}</td>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <td class="text-right">
              <v-icon color="primary" @click="editProduct(item)">mdi-pencil</v-icon>
              <v-icon color="red" @click="openDeleteDialog(item)">mdi-delete</v-icon>
            </td>
          </template>

          <template v-slot:no-data>
            <v-alert type="warning" dense>Não há produtos cadastrados.</v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o produto <strong>{{ selectedProduct?.name }}</strong> permanentemente?
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" text @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Criar Novo Produto</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
              v-model="newProduct.name"
              label="Nome"
              required
          ></v-text-field>
          <v-text-field
              v-model="newProduct.price"
              label="Preço"
              type="number"
              required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="createProduct">Criar Produto</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar Produto</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
              v-model="selectedProduct.name"
              label="Nome"
              required
          ></v-text-field>
          <v-text-field
              v-model="selectedProduct.price"
              label="Preço"
              type="number"
              required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="updateProduct">Salvar alterações</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      searchQuery: '',
      newProduct: {
        name: '',
        price: ''
      },
      selectedProduct: null,
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      showErrorAlert: false,
      errorMessage: '',
      headers: [
        { title: 'Nome', align: 'start', key: 'name' },
        { title: 'Preço', align: 'start', key: 'price' },
        { title: 'Criado em', align: 'start', key: 'createdAt' },
        { title: 'Atualizado em', align: 'start', key: 'updatedAt' },
        { title: 'Ações', align: 'start', key: 'actions', sortable: false }
      ]
    };
  },
  mounted() {
    this.fetchProducts();
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:3000/products');
        this.products = response.data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    },

    openDeleteDialog(product) {
      this.selectedProduct = { ...product };
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        if (this.selectedProduct) {
          await axios.delete(`http://localhost:3000/products/${this.selectedProduct.product_id}`);
          await this.fetchProducts();
        }
      } catch (error) {
        if (error.response?.data?.message?.includes('associated')) {
          this.errorMessage = 'Não é possível excluir produtos com pedidos associados!';
          this.showErrorAlert = true;

          setTimeout(() => {
            this.showErrorAlert = false;
          }, 5000);
        } else {
          this.errorMessage = 'Erro ao excluir produto';
          this.showErrorAlert = true;
          setTimeout(() => {
            this.showErrorAlert = false;
          }, 5000);
          console.error('Erro ao excluir produto:', error);
        }
      } finally {
        this.deleteDialog = false;
        this.selectedProduct = null;
      }
    },

    editProduct(product) {
      this.selectedProduct = { ...product };
      this.editDialog = true;
    },

    createProduct() {
      axios.post('http://localhost:3000/products', this.newProduct)
          .then(() => {
            this.fetchProducts();
            this.closeCreateModal();
          })
          .catch(error => {
            console.error('Erro ao criar produto:', error);
          });
    },

    openCreateModal() {
      this.createDialog = true;
    },

    closeCreateModal() {
      this.createDialog = false;
      this.newProduct = { name: '', price: '' };
    },

    closeEditModal() {
      this.editDialog = false;
      this.selectedProduct = { name: '', price: '' };
    },

    async updateProduct() {
      try {
        await axios.put(`http://localhost:3000/products/${this.selectedProduct.product_id}`, this.selectedProduct);
        await this.fetchProducts();
        this.closeEditModal();
      } catch (error) {
        console.error('Erro ao editar produto:', error);
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    },

    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}

.custom-text-field {
  max-width: 500px;
}
</style>
