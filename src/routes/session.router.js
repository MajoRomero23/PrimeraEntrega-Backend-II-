import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Ruta para el registro
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;
        const ageNumber = Number(age);

        if (isNaN(ageNumber) || ageNumber <= 0) {
            return res.status(400).json({ message: 'La edad debe ser un número válido mayor a 0.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age: ageNumber,
        });

        await newUser.save();
        req.session.user = newUser;

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para login
router.post('/sessions/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        req.session.user = user;

        res.status(200).json({ message: 'Login exitoso' });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;
