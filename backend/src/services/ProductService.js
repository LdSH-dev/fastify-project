const Product = require('../models/Product');
const { sequelize } = require('../database/connection');
const { Op } = require('sequelize');

class CannotDeleteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CannotDeleteError';
    }
}

const ProductService = {
    getAllProducts: async () => {
        return await Product.findAll();
    },

    createProduct: async (productData) => {
        return await Product.create(productData);
    },

    updateProduct: async (productId, updateData) => {
        const product = await Product.findByPk(productId);
        if (!product) return null;

        return await product.update(updateData);
    },

    deleteProduct: async (productId) => {
        const product = await Product.findOne({
            where: { product_id: productId },
        });

        if (!product) return null;

        const orderItems = await sequelize.query(
            'SELECT * FROM OrderItems WHERE product_id = :productId',
            {
                replacements: { productId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (orderItems.length > 0) {
            throw new CannotDeleteError('Cannot delete product with existing orders');
        }

        await product.destroy();
        return true;
    },
};

module.exports = { ProductService, CannotDeleteError };