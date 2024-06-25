const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB', err);
});

// Middleware
app.use(express.json());

// Modelo de datos
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const Item = mongoose.model('Item', itemSchema);

// Rutas CRUD
app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send(newItem);
});

app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.status(200).send(items);
});

app.get('/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.status(200).send(item);
});

app.put('/items/:id', async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(item);
});

app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
