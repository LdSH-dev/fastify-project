const fastify = require('fastify')({ logger: true });
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");

fastify.register(require('@fastify/cors'), {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
});
fastify.register(productRoutes);
fastify.register(orderRoutes);
fastify.register(customerRoutes);

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server running on http://localhost:3000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
