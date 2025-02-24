<template>
  <v-container>
    <v-row>
      <v-col cols="12" style="margin-top: 3rem">
        <v-subheader style="color:white;" class="text-h3 font-weight-bold primary--text">
          Lista de Pedidos
        </v-subheader>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between">
      <v-col cols="12" md="8">
        <v-autocomplete
            v-model="selectedCustomer"
            :items="customerOptions"
            label="Filtrar por cliente"
            item-title="text"
            item-value="value"
            clearable
            solo
            class="custom-search"
            placeholder="Selecione um cliente"
            prepend-inner-icon="mdi-account-search"
        ></v-autocomplete>
      </v-col>

      <v-col cols="12" md="auto" class="text-right">
        <v-btn
            color="primary"
            @click="openCreateModal"
            class="white--text"
        >
          <v-icon left>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
            :headers="headers"
            :items="filteredOrders"
            :items-per-page="10"
            :loading="loading"
            loading-text="Carregando pedidos..."
            item-key="order_id"
            class="elevation-2"
            @click:row="openDetailsModal"
        >
          <template v-slot:[`item.date`]="{ item }">
            <td>{{ formatDateTime(item.date) }}</td>
          </template>

          <template v-slot:[`item.createdAt`]="{ item }">
            <td>{{ formatDateTime(item.createdAt) }}</td>
          </template>

          <template v-slot:[`item.updatedAt`]="{ item }">
            <td>{{ formatDateTime(item.updatedAt) }}</td>
          </template>

          <template v-slot:[`item.customer.name`]="{ item }">
            <td>{{ item.customer.name }}</td>
          </template>

          <template v-slot:[`item.total`]="{ item }">
            <td class="text-right">{{ formatCurrency(item.total) }}</td>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <td class="text-right">
              <v-icon
                  color="primary"
                  @click.stop="editOrder(item)"
                  class="mr-2"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                  color="error"
                  @click.stop="deleteOrder(item.order_id)"
              >
                mdi-delete
              </v-icon>
            </td>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="ma-4">
              Nenhum pedido encontrado
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="detailsDialog" max-width="800" scrollable>
      <order-details
          v-if="selectedOrder"
          :order="selectedOrder"
          :products="products"
          @close="detailsDialog = false"
      />
    </v-dialog>

    <order-create
        v-model="createDialog"
        :customers="customers"
        :products="products"
        @created="handleOrderCreated"
    />

    <order-edit
        v-model="editDialog"
        :order="selectedOrder"
        :customers="customers"
        :products="products"
        @updated="handleOrderUpdated"
    />
  </v-container>
</template>

<script>
import axios from 'axios'
import OrderCreate from './OrderCreate.vue'
import OrderEdit from './OrderEdit.vue'
import OrderDetails from './OrderDetails.vue'

export default {
  components: {
    OrderCreate,
    OrderEdit,
    OrderDetails
  },
  data() {
    return {
      orders: [],
      customers: [],
      products: [],
      selectedCustomer: null,
      loading: true,
      headers: [
        { title: 'Data', value: 'date', sortable: true, width: '180px' },
        { title: 'Cliente', value: 'customer.name', sortable: true, width: '250px' },
        { title: 'Valor Total', value: 'total', sortable: true, width: '150px', align: 'right' },
        { title: 'Criado em', value: 'createdAt', sortable: true, width: '180px' },
        { title: 'Atualizado em', value: 'updatedAt', sortable: true, width: '180px' },
        { title: 'Ações', value: 'actions', sortable: false, width: '120px', align: 'right' }
      ],
      detailsDialog: false,
      createDialog: false,
      editDialog: false,
      selectedOrder: null
    }
  },
  computed: {
    customerOptions() {
      return this.customers.map(c => ({
        value: c.customer_id,
        text: c.name
      }))
    },
    filteredOrders() {
      return this.orders
          .map(order => ({
            ...order,
            total: this.calculateOrderTotal(order.items)
          }))
          .filter(order => {
            if (!this.selectedCustomer) return true
            return order.customer.customer_id === this.selectedCustomer
          })
    }
  },
  methods: {
    async fetchData() {
      try {
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:3000/orders'),
          axios.get('http://localhost:3000/customers'),
          axios.get('http://localhost:3000/products')
        ])

        this.orders = ordersRes.data
        this.customers = customersRes.data
        this.products = productsRes.data
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        this.loading = false
      }
    },

    calculateOrderTotal(items) {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    formatDateTime(value) {
      if (!value) return ''
      const date = new Date(value)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    },

    openDetailsModal(event, { item }) {
      this.selectedOrder = item
      this.detailsDialog = true
    },

    openCreateModal() {
      this.createDialog = true
    },

    async handleOrderCreated() {
      await this.fetchData()
      this.createDialog = false
    },

    editOrder(order) {
      this.selectedOrder = order
      this.editDialog = true
    },

    async handleOrderUpdated() {
      await this.fetchData()
      this.editDialog = false
    },

    async deleteOrder(orderId) {
      if (confirm('Tem certeza que deseja excluir este pedido?')) {
        try {
          await axios.delete(`http://localhost:3000/orders/${orderId}`)
          await this.fetchData()
        } catch (error) {
          console.error('Erro ao excluir pedido:', error)
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.custom-search {
  max-width: 500px;
}

.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-data-table >>> tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.v-data-table >>> tbody tr:hover {
  background-color: #f5f5f5;
}

.v-subheader {
  padding: 0;
  height: auto;
}
</style>