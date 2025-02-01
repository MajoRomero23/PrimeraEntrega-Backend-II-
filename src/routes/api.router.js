import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js'; 
import { createHash, isValidPassword } from '../utils/passwordUtils'; 

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey'; 

// Registro de usuarios
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya registrado' });
        }

        const hashedPassword = createHash(password);
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Inicio de sesión
router.post('/api/login', async (req, res) => {
    console.debug("yes, yes");
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000, 
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

export default router;
