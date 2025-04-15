const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// Ruta para sincronizar clientes (solo accesible para admin)
router.post('/sync', [verificarToken, esAdmin], clientController.syncClients);

module.exports = router;
