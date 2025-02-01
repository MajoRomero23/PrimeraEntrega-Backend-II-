import express from 'express';
import { isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/login', isLoggedOut, (req, res) => {
    res.render('login');
});

router.get('/register', isLoggedOut, (req, res) => {
    res.render('register');
});

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('perfil', { user: req.session.user });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

router.post('/login', isLoggedOut, async (req, res) => {
    const { email, password } = req.body;
    try {
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
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;
