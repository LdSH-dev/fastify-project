import { createRouter, createWebHistory } from 'vue-router';
import ProductPage from '@/components/ProductPage.vue';
import CustomerPage from '@/components/CustomerPage.vue';
import OrderPage from '@/components/OrderPage.vue';

const routes = [
    {
        path: '/',
        name: 'products',
        component: ProductPage
    },
    {
        path: '/products',
        name: 'products',
        component: ProductPage
    },
    {
        path: '/customers',
        name: 'customers',
        component: CustomerPage
    },
    {
        path: '/orders',
        name: 'orders',
        component: OrderPage
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
