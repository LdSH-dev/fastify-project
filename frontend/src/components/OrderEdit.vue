<template>
  <v-dialog :value="value" max-width="500px" @input="$emit('input', $event)">
    <v-card>
      <v-card-title>
        <span class="text-h5">Editar Pedido #{{ order.order_id }}</span>
      </v-card-title>

      <v-card-text>
        <v-autocomplete
            v-model="editedOrder.customer_id"
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
          <tr v-for="(item, index) in editedOrder.items" :key="index">
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
        <v-btn color="primary" @click="updateOrder">Salvar Alterações</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    value: Boolean,
    order: {
      type: Object,
      required: true
    },
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
      editedOrder: {
        order_id: null,
        customer_id: null,
        items: []
      },
      selectedProduct: {
        product_id: null,
        quantity: 1
      }
    };
  },
  computed: {
    availableProducts() {
      const addedIds = this.editedOrder.items.map(item => item.product_id);
      return this.products.filter(p => !addedIds.includes(p.product_id));
    },
    canAddToCart() {
      return this.selectedProduct.product_id && this.selectedProduct.quantity > 0;
    }
  },
  watch: {
    order: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editedOrder = {
            order_id: newVal.order_id,
            customer_id: newVal.customer.customer_id,
            items: newVal.items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity
            }))
          };
        }
      }
    }
  },
  methods: {
    addToCart() {
      const { product_id, quantity } = this.selectedProduct;
      const existing = this.editedOrder.items.find(item => item.product_id === product_id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        this.editedOrder.items.push({ product_id, quantity });
      }

      this.selectedProduct = { product_id: null, quantity: 1 };
    },
    removeFromCart(index) {
      this.editedOrder.items.splice(index, 1);
    },
    async updateOrder() {
      try {
        const payload = {
          items: this.editedOrder.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          }))
        };

        await axios.put(`http://localhost:3000/orders/${this.editedOrder.order_id}`, payload);
        this.$emit('updated');
        this.close();
      } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
      }
    },
    getProductName(productId) {
      const product = this.products.find(p => p.product_id === productId);
      return product ? product.name : 'Produto não encontrado';
    },
    close() {
      this.$emit('input', false);
      this.editedOrder = { order_id: null, customer_id: null, items: [] };
      this.selectedProduct = { product_id: null, quantity: 1 };
    }
  }
};
</script>