const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt'); 
const { createHash } = require('../utils/hashUtils');

const postLogin = (req, res) => {
    const { email, password } = req.body;
    if (email === "coder@coder.com" && password === "password") {
        const token = jwt.sign({ email, role: "user" }, "coderSecret", { expiresIn: "24h" });
        res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).send({ message: "Login correcto" });
    } else {
        res.status(401).send({ message: "Información inválida" });
    }
};

// Registro de nuevo usuario
const postRegister = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Comfirmación de que es un usuario nuevo
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: "El correo electrónico ya está en uso" });
    }

    // Encritando la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new UserModel({
        first_name,
        last_name,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).send({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send({ message: 'Error al registrar el usuario' });
    }
};

module.exports = {
    postLogin,
    postRegister,
};
