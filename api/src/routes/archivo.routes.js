const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivo.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// Rutas para archivos
router.get('/tickets/:ticketId/archivos', verificarToken, archivoController.getArchivosPorTicket);
router.get('/archivos/:archivoId', verificarToken, archivoController.descargarArchivo);
router.get('/comentarios/archivos/:archivoId', verificarToken, archivoController.descargarArchivoComentario);
router.delete('/archivos/:archivoId', verificarToken, archivoController.eliminarArchivo);

module.exports = router;
