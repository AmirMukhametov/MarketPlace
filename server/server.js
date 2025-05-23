const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Сервер работает</h1>")
});

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (err) {
        res.status(500).json({err: 'Ошибка при получении товара'});
    }
});

app.post("/products", async (req, res) => {
    try {
        const { name, price, description} = req.body;
        const newProduct = new Product({ name, price, description});
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при добавлении товара' });
    }
});

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Amir:123@clustermarketplace.obnsxja.mongodb.net/marketplace?retryWrites=true&w=majority');
        app.listen(PORT, () => {
        console.log(`Сервер запущен по порту ${PORT}`)
        });
    } catch (err) {
        console.log(err)
    }
}

start();