const OrderController = require('../controllers/OrderController');

const orderRoutes = (fastify, options, done) => {
    fastify.get('/orders', OrderController.getAll);
    fastify.post('/orders', OrderController.create);
    fastify.put('/orders/:order_id', OrderController.update);
    fastify.delete('/orders/:order_id', OrderController.delete);

    done();
};

module.exports = orderRoutes;
