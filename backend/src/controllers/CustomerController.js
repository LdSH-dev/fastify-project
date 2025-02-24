const { CustomerService, CannotDeleteError } = require('../services/CustomerService');

const CustomerController = {
    getAll: async (req, reply) => {
        const customers = await CustomerService.getAllCustomers();
        return reply.send(customers);
    },

    create: async (req, reply) => {
        const customer = await CustomerService.createCustomer(req.body);
        return reply.code(201).send(customer);
    },

    update: async (req, reply) => {
        const { customer_id } = req.params;
        const customer = await CustomerService.updateCustomer(customer_id, req.body);

        if (!customer) {
            return reply.code(404).send({ message: 'Customer not found' });
        }
        return reply.send(customer);
    },

    delete: async (req, reply) => {
        const { customer_id } = req.params;
        try {
            const result = await CustomerService.deleteCustomer(customer_id);

            if (!result) {
                return reply.code(404).send({ message: 'Customer not found' });
            }
            return reply.send({ message: 'Customer deleted' });

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

module.exports = CustomerController;