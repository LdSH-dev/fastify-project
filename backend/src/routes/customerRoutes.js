const CustomerController = require('../controllers/CustomerController');

const customerRoutes = (fastify, options, done) => {
    fastify.get('/customers', CustomerController.getAll);
    fastify.post('/customers', CustomerController.create);
    fastify.put('/customers/:customer_id', CustomerController.update);
    fastify.delete('/customers/:customer_id', CustomerController.delete);

    done();
};

module.exports = customerRoutes;
