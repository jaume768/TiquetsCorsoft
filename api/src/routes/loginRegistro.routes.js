const express = require('express');
const router = express.Router();
const loginRegistroController = require('../controllers/loginRegistro.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// Rutas exclusivas para administradores
router.get('/', [verificarToken, esAdmin], loginRegistroController.getLoginRegistros);
router.get('/estadisticas', [verificarToken, esAdmin], loginRegistroController.getLoginEstadisticas);

module.exports = router;
