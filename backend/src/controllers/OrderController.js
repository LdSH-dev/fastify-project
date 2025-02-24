const OrderService = require('../services/OrderService');

const OrderController = {

    getAll: async (req, reply) => {
        try {
            const orders = await OrderService.getAll();
            return reply.send(orders);
        } catch (error) {
            return reply.code(500).send({ message: 'Error fetching orders', error: error.message });
        }
    },

    create: async (req, reply) => {
        const { customer_id, items } = req.body;
        try {
            const order = await OrderService.create(customer_id, items);
            return reply.code(201).send(order);
        } catch (error) {
            return reply.code(400).send({ message: error.message });
        }
    },

    update: async (req, reply) => {
        const { order_id } = req.params;
        const { items } = req.body;
        try {
            const order = await OrderService.update(order_id, items);
            return reply.send(order);
        } catch (error) {
            return reply.code(400).send({ message: error.message });
        }
    },

    delete: async (req, reply) => {
        const { order_id } = req.params;
        try {
            const result = await OrderService.delete(order_id);
            return reply.send(result);
        } catch (error) {
            return reply.code(404).send({ message: error.message });
        }
    }
};

module.exports = OrderController;
