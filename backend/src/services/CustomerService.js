const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { Op } = require('sequelize');

class CannotDeleteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CannotDeleteError';
    }
}

const CustomerService = {
    getAllCustomers: async () => {
        return await Customer.findAll();
    },

    createCustomer: async (customerData) => {
        return await Customer.create(customerData);
    },

    updateCustomer: async (customerId, updateData) => {
        const customer = await Customer.findByPk(customerId);
        if (!customer) return null;

        return await customer.update(updateData);
    },

    deleteCustomer: async (customerId) => {
        const customer = await Customer.findOne({
            where: { customer_id: customerId },
            include: [{
                model: Order,
                as: 'orders',
                required: false
            }]
        });

        if (!customer) return null;

        if (customer.orders && customer.orders.length > 0) {
            throw new CannotDeleteError('Cannot delete customer with existing orders');
        }

        await customer.destroy();
        return true;
    }
};

module.exports = {
    CustomerService,
    CannotDeleteError
};