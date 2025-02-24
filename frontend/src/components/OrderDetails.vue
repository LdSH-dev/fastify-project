<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center primary white--text">
      <span>Detalhes do Pedido #{{ order.order_id }}</span>
      <v-btn icon @click="$emit('close')" class="white--text">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pa-4">
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <div class="text-body-1">
            <strong>Cliente:</strong> {{ order.customer.name }}
          </div>
          <div class="text-body-1">
            <strong>Email:</strong> {{ order.customer.email }}
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-body-1">
            <strong>Data do Pedido:</strong> {{ formatDateTime(order.date) }}
          </div>
          <div class="text-body-1">
            <strong>Total do Pedido:</strong> {{ formatCurrency(totalOrder) }}
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Produto</th>
            <th class="text-center">Quantidade</th>
            <th class="text-right">Preço Unitário</th>
            <th class="text-right">Subtotal</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in order.items" :key="index">
            <td class="text-left">{{ getProductName(item.product_id) }}</td>
            <td class="text-center">{{ item.quantity }}</td>
            <td class="text-center">{{ formatCurrency(item.price) }}</td>
            <td class="text-right">{{ formatCurrency(item.price * item.quantity) }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>


      <v-row class="mt-4">
        <v-col cols="12" class="text-right">
          <div class="text-h6">
            Total: {{ formatCurrency(totalOrder) }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('close')">Fechar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true
    },
    products: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalOrder() {
      return this.order.items.reduce((total, item) =>
          total + (item.price * item.quantity), 0)
    }
  },
  methods: {
    getProductName(productId) {
      const product = this.products.find(p => p.product_id === productId)
      return product?.name || 'Produto não encontrado'
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    },
    formatDateTime(value) {
      if (!value) return ''
      const date = new Date(value)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.header-cell {
  padding: 12px 24px;
  letter-spacing: 0.5px;
  background-color: #f5f5f5;
}

.v-data-table {
  border-collapse: separate;
  border-spacing: 0 8px;
}

.v-data-table >>> th {
  font-weight: 600;
}

th, td {
  padding: 12px 16px !important;
}

th {
  font-weight: 600;
  background-color: #f5f5f5;
}

.text-left {
  text-align: left !important;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}
</style>