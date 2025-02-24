<template>
  <v-dialog v-model="localDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Criar Novo Pedido</span>
      </v-card-title>

      <v-card-text>
        <v-autocomplete
            v-model="newOrder.customer_id"
            :items="customers"
            item-title="name"
            item-value="customer_id"
            label="Selecionar Cliente"
            required
            solo
        ></v-autocomplete>

        <template v-if="availableProducts.length > 0">
          <v-row>
            <v-col cols="8">
              <v-autocomplete
                  v-model="selectedProduct.product_id"
                  :items="availableProducts"
                  item-title="name"
                  item-value="product_id"
                  label="Selecionar Produto"
                  required
                  solo
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="selectedProduct.quantity"
                  label="Quantidade"
                  type="number"
                  min="1"
                  required
                  solo
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
              @click="addToCart"
              color="primary"
              block
              :disabled="!canAddToCart"
          >
            Adicionar ao Carrinho
          </v-btn>
        </template>
        <v-alert v-else type="info" class="my-4">
          Todos os produtos já foram adicionados ao carrinho
        </v-alert>

        <v-divider class="my-4"></v-divider>
        <v-table>
          <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in newOrder.items" :key="index">
            <td>{{ getProductName(item.product_id) }}</td>
            <td>
              <v-text-field
                  v-model="item.quantity"
                  type="number"
                  min="1"
                  dense
                  solo
                  style="max-width: 100px;"
              ></v-text-field>
            </td>
            <td>
              <v-btn icon @click="removeFromCart(index)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Fechar</v-btn>
        <v-btn color="primary" @click="createOrder">Criar Pedido</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    modelValue: Boolean,
    customers: {
      type: Array,
      default: () => []
    },
    products: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localDialog: this.modelValue,
      newOrder: {
        customer_id: null,
        items: []
      },
      selectedProduct: {
        product_id: null,
        quantity: 1
      }
    };
  },
  watch: {
    modelValue(newVal) {
      this.localDialog = newVal;
    },
    localDialog(newVal) {
      this.$emit('update:modelValue', newVal);
    }
  },
  computed: {
    availableProducts() {
      const addedIds = this.newOrder.items.map(item => item.product_id);
      return this.products.filter(p => !addedIds.includes(p.product_id));
    },
    canAddToCart() {
      return this.selectedProduct.product_id && this.selectedProduct.quantity > 0;
    }
  },
  methods: {
    addToCart() {
      const { product_id, quantity } = this.selectedProduct;
      const existing = this.newOrder.items.find(item => item.product_id === product_id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        this.newOrder.items.push({ product_id, quantity });
      }

      this.selectedProduct = { product_id: null, quantity: 1 };
    },
    removeFromCart(index) {
      this.newOrder.items.splice(index, 1);
    },
    async createOrder() {
      try {
        const payload = {
          customer_id: this.newOrder.customer_id,
          items: this.newOrder.items
        };
        await axios.post('http://localhost:3000/orders', payload);
        this.$emit('created', false);
        this.closeDialog();
      } catch (error) {
        console.error('Erro ao criar pedido:', error);
      }
    },
    getProductName(productId) {
      const product = this.products.find(p => p.product_id === productId);
      return product ? product.name : 'Produto não encontrado';
    },
    closeDialog() {
      this.localDialog = false;
      this.resetForm();
    },
    resetForm() {
      this.newOrder = {
        customer_id: null,
        items: []
      };
      this.selectedProduct = {
        product_id: null,
        quantity: 1
      };
    }
  }
};
</script>