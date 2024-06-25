const User = require('../models/user');
const Product = require('../models/Product'); // Asumiendo que tienes un modelo Product definido

async function findUserByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error('Error al buscar usuario por email:', error);
        throw error;
    }
}

async function getAllProducts() {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        throw error;
    }
}

async function createShoppingList(userId, listData) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const newList = {
            id: user.ShoppingLists.length + 1,
            name: listData.name,
            date: new Date().toISOString(),
            items: []
        };

        user.ShoppingLists.push(newList);
        await user.save();

        return newList;
    } catch (error) {
        console.error('Error al crear lista de compras:', error);
        throw error;
    }
}

async function addProductToList(userId, listId, productId, quantity) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const shoppingList = user.ShoppingLists.find(list => list.id === listId);
        if (!shoppingList) {
            throw new Error('Lista de compras no encontrada');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const newItem = {
            id: shoppingList.items.length + 1,
            name: product.name,
            quantity,
            amount: product.amount.find(amt => amt.id === 1).amount,
            price: product.price * quantity
        };

        shoppingList.items.push(newItem);
        await user.save();

        return shoppingList;
    } catch (error) {
        console.error('Error al agregar producto a la lista:', error);
        throw error;
    }
}

async function calculateTotal(userId, listId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const shoppingList = user.ShoppingLists.find(list => list.id === listId);
        if (!shoppingList) {
            throw new Error('Lista de compras no encontrada');
        }

        let total = 0;
        shoppingList.items.forEach(item => {
            total += item.price;
        });

        return total;
    } catch (error) {
        console.error('Error al calcular el total de la compra:', error);
        throw error;
    }
}

module.exports = {
    findUserByEmail,
    getAllProducts,
    createShoppingList,
    addProductToList,
    calculateTotal
};
