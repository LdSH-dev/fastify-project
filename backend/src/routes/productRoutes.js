const ProductController = require('../controllers/ProductController');

const productRoutes = (fastify, options, done) => {
    fastify.get('/products', ProductController.getAll);
    fastify.post('/products', ProductController.create);
    fastify.put('/products/:id', ProductController.update);
    fastify.delete('/products/:id', ProductController.delete);

    done();
};

module.exports = productRoutes;
