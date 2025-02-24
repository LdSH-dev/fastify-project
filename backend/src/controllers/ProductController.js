const { ProductService, CannotDeleteError } = require('../services/ProductService');

const ProductController = {
    getAll: async (req, reply) => {
        const products = await ProductService.getAllProducts();
        return reply.send(products);
    },

    create: async (req, reply) => {
        const product = await ProductService.createProduct(req.body);
        return reply.code(201).send(product);
    },

    update: async (req, reply) => {
        const { id } = req.params;
        const product = await ProductService.updateProduct(id, req.body);

        if (!product) {
            return reply.code(404).send({ message: 'Product not found' });
        }
        return reply.send(product);
    },

    delete: async (req, reply) => {
        const { id } = req.params;
        try {
            const result = await ProductService.deleteProduct(id);

            if (!result) {
                return reply.code(404).send({ message: 'Product not found' });
            }
            return reply.send({ message: 'Product deleted' });

        } catch (error) {
            if (error instanceof CannotDeleteError) {
                return reply.code(400).send({
                    message: error.message,
                    errorCode: 'HAS_ACTIVE_ORDERS'
                });
            }
            throw error;
        }
    }
};

module.exports = ProductController;