const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { Op } = require('sequelize');
const OrderService = {

    getAll: async () => {
        try {
            return await Order.findAll({
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                    },
                    {
                        model: OrderItem,
                        as: 'items',
                    }
                ],
            });
        } catch (error) {
            throw new Error('Error fetching orders: ' + error.message);
        }
    },

    create: async (customer_id, items) => {
        try {
            const order = await Order.create({ customer_id });

            for (const item of items) {
                const product = await Product.findByPk(item.product_id);

                if (product) {
                    await OrderItem.create({
                        order_id: order.order_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: product.price,
                    });
                } else {
                    throw new Error(`Product with ID ${item.product_id} not found`);
                }
            }

            return order;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    update: async (order_id, items) => {
        try {
            const order = await Order.findByPk(order_id);

            if (order) {
                await OrderItem.destroy({ where: { order_id } });

                for (const item of items) {
                    const product = await Product.findByPk(item.product_id);

                    if (product) {
                        await OrderItem.create({
                            order_id: order.order_id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: product.price
                        });
                    } else {
                        throw new Error(`Product with ID ${item.product_id} not found`);
                    }
                }

                return order;
            } else {
                throw new Error('Order not found');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    delete: async (order_id) => {
        try {
            const order = await Order.findByPk(order_id);

            if (order) {
                await OrderItem.destroy({ where: { order_id } });
                await order.destroy();
                return { message: 'Order deleted' };
            } else {
                throw new Error('Order not found');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = OrderService;
