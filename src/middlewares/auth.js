import express from 'express';

export const isLoggedIn = (req, res, next) => {
    if (req.session.user){
        next();
    } else {
        res.redirect('/login');
    }
}

export const isLoggedOut = (req, res, next) => {
    if (req.session.user){
        res.redirect('/perfil');
    } else {
        next();
    }
}
