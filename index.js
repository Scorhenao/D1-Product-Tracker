const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const { authenticateUser } = require('./services/loginService');
const User = require('./models/user');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'D1_productTracker' // Nombre correcto de la base de datos
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB', err);
});


// Middleware
app.use(express.json());

// Rutas CRUD para los items (si es necesario definirlas)

// Endpoint para el login
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    // Validar campos requeridos
    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Se requieren username/email y password.' });
    }

    try {
        // Autenticar usuario
        const authenticatedUser = await authenticateUser(usernameOrEmail, password);

        if (!authenticatedUser) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Redirigir al usuario a la vista de usuario
        res.redirect('/user');
    } catch (error) {
        console.error('Error al procesar la solicitud de login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Endpoint para servir el archivo login.html desde /login
app.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, 'views', 'login.html');
    res.sendFile(loginPath);
});

// Endpoint para servir el archivo user.html desde /user
app.get('/user', (req, res) => {
    const userPath = path.join(__dirname, 'views', 'user.html');
    res.sendFile(userPath);
});

// Endpoint para servir el archivo index.html desde la raíz
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(indexPath);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
