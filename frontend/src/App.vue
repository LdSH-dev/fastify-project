<template>
  <v-app>
    <v-app-bar app color="white" elevate-on-scroll>
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <img
                src="https://i0.wp.com/znap.com.br/wp-content/uploads/2024/08/image-1.png?w=1688&ssl=1"
                alt="Logo"
                height="40"
            />
          </v-col>
          <v-col cols="12" sm="8" class="d-flex justify-end align-center">
            <v-btn class="menu-btn" @click="goToPage('products')">Produtos</v-btn>
            <v-btn class="menu-btn" @click="goToPage('customers')">Clientes</v-btn>
            <v-btn class="menu-btn" @click="goToPage('orders')">Pedidos</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goToPage(page) {
      this.$router.push({ name: page });
    }
  }
}
</script>

<style scoped>
.v-app-bar {
  background-color: white;
}

.menu-btn {
  color: white;
  font-size: 16px;
  text-transform: capitalize;
  background: linear-gradient(90deg, rgba(255, 105, 180, 1), rgba(255, 165, 0, 0.7));
  margin: 0 10px;
  border-radius: 10px;
  padding: 8px 20px;
  transition: background 0.3s ease;
}

.menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-btn:hover {
  background: linear-gradient(90deg, rgba(255, 182, 193, 0.8), rgba(255, 185, 0, 0.8));
}

.v-app-bar .v-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-main {
  background: linear-gradient(90deg, rgba(255, 105, 180, 0.5), rgba(255, 165, 0, 0.3));
  min-height: 100vh;
}
</style>
