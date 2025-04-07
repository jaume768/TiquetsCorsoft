const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken: authMiddleware } = require('../middleware/auth.middleware');

// Ruta para login tradicional (email/password)
router.post('/login', authController.login);

// Ruta para registro de usuarios
router.post('/register', authController.register);

// Ruta para login automático por parámetros URL
router.get('/auto-login', authController.autoLogin);

// Ruta para verificar token y obtener usuario
router.get('/verificar', authMiddleware, authController.verificarToken);

module.exports = router;
