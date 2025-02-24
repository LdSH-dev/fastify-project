<template>
  <v-container>
    <!-- Alertas -->
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
        <v-subheader style="color:white; font-weight: bold;" class="text-h3">Lista de Clientes</v-subheader>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between">
      <v-col cols="8">
        <v-text-field
            v-model="searchQuery"
            label="Pesquisar clientes"
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
            :items="filteredCustomers"
            item-key="customer_id"
            class="elevation-1"
        >
          <template v-slot:[`item.name`]="{ item }">
            <td>{{ item.name }}</td>
          </template>
          <template v-slot:[`item.email`]="{ item }">
            <td>{{ item.email }}</td>
          </template>
          <template v-slot:[`item.updatedAt`]="{ item }">
            <td>{{ formatDate(item.updatedAt) }}</td>
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">
            <td>{{ formatDate(item.createdAt) }}</td>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <td class="text-right">
              <v-icon color="primary" @click="editCustomer(item)">mdi-pencil</v-icon>
              <v-icon color="red" @click="openDeleteDialog(item)">mdi-delete</v-icon>
            </td>
          </template>

          <template v-slot:no-data>
            <v-alert type="warning" dense>Não há clientes cadastrados.</v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o cliente <strong>{{ selectedCustomer?.name }}</strong> permanentemente?
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
          <span class="text-h5">Criar Novo Cliente</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
              v-model="newCustomer.name"
              label="Nome"
              required
          ></v-text-field>
          <v-text-field
              v-model="newCustomer.email"
              label="Email"
              required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="createCustomer">Criar Cliente</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar Cliente</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
              v-model="selectedCustomer.name"
              label="Nome"
              required
          ></v-text-field>
          <v-text-field
              v-model="selectedCustomer.email"
              label="Email"
              required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="updateCustomer">Salvar alterações</v-btn>
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
      customers: [],
      searchQuery: '',
      newCustomer: {
        name: '',
        email: '',
      },
      selectedCustomer: null,
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      showErrorAlert: false,
      errorMessage: '',
      headers: [
        { title: 'Nome', align: 'start', key: 'name' },
        { title: 'Email', align: 'start', key: 'email' },
        { title: 'Atualizado em', align: 'start', key: 'updatedAt' },
        { title: 'Criado em', align: 'start', key: 'createdAt' },
        { title: 'Ações', align: 'start', key: 'actions', sortable: false }
      ]
    };
  },
  mounted() {
    this.fetchCustomers();
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter(customer => {
        return customer.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await axios.get('http://127.0.0.1:3000/customers');
        this.customers = response.data;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    },

    openDeleteDialog(customer) {
      this.selectedCustomer = customer;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        if (this.selectedCustomer) {
          await axios.delete(`http://localhost:3000/customers/${this.selectedCustomer.customer_id}`);
          await this.fetchCustomers();
        }
      } catch (error) {
        if (error.response?.data?.message?.includes('associated')) {
          this.errorMessage = 'Não é possível excluir clientes com pedidos associados!';
          this.showErrorAlert = true;

          setTimeout(() => {
            this.showErrorAlert = false;
          }, 5000);
        } else {
          this.errorMessage = 'Erro ao excluir cliente';
          this.showErrorAlert = true;
          setTimeout(() => {
            this.showErrorAlert = false;
          }, 5000);
          console.error('Erro ao excluir cliente:', error);
        }
      } finally {
        this.deleteDialog = false;
        this.selectedCustomer = null;
      }
    },

    editCustomer(customer) {
      this.selectedCustomer = { ...customer };
      this.editDialog = true;
    },

    async updateCustomer() {
      try {
        await axios.put(`http://localhost:3000/customers/${this.selectedCustomer.customer_id}`, this.selectedCustomer);
        await this.fetchCustomers();
        this.editDialog = false;
      } catch (error) {
        console.error('Erro ao editar cliente:', error);
      }
    },

    createCustomer() {
      axios.post('http://localhost:3000/customers', this.newCustomer)
          .then(() => {
            this.fetchCustomers();
            this.closeCreateModal();
          })
          .catch(error => {
            console.error('Erro ao criar cliente:', error);
          });
    },

    openCreateModal() {
      this.createDialog = true;
    },

    closeCreateModal() {
      this.createDialog = false;
      this.newCustomer = { name: '', email: '' };
    },

    closeEditModal() {
      this.editDialog = false;
      this.selectedCustomer = null;
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