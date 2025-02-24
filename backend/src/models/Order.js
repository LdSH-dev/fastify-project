const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const Customer = require('./Customer');
const OrderItem = require('./OrderItem');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'customer_id',
        },
        allowNull: false,
    },
});

Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' , as: 'items' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });

module.exports = Order;
