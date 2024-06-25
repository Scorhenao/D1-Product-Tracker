const bcrypt = require('bcrypt');
const User = require('../models/user');

async function authenticateUser(usernameOrEmail, password) {
    try {
        // Buscar al usuario por su username o email
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
        if (!user) {
            return null; // Si el usuario no existe, retornar null
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null; // Si las contraseñas no coinciden, retornar null
        }

        // Si las credenciales son válidas, devolver el usuario
        return {
            username: user.username,
            email: user.email
        };
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        throw error;
    }
}

module.exports = {
    authenticateUser
};
