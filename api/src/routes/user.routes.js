const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// Rutas para usuarios normales
router.get('/perfil', verificarToken, userController.getPerfil);
router.put('/perfil', verificarToken, userController.actualizarPerfil);

// Rutas solo para admin
router.get('/', [verificarToken, esAdmin], userController.getTodosUsuarios);
router.get('/:id', [verificarToken, esAdmin], userController.getUsuarioPorId);
router.put('/:id', [verificarToken, esAdmin], userController.actualizarUsuario);
router.delete('/:id', [verificarToken, esAdmin], userController.eliminarUsuario);

module.exports = router;
