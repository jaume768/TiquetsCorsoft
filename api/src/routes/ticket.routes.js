const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Rutas para todos los usuarios (autenticados)
router.get('/mis-tiquets', verificarToken, ticketController.getMisTiquets);
router.post('/', verificarToken, upload.array('archivos', 5), ticketController.crearTiquet);
router.get('/:id', verificarToken, ticketController.getTiquetPorId);

// Rutas para comentarios de tiquets
router.post('/:id/comentarios', verificarToken, ticketController.agregarComentario);
router.get('/:id/comentarios', verificarToken, ticketController.getComentariosTiquet);
router.delete('/:tiquet_id/comentarios/:comentario_id', verificarToken, ticketController.eliminarComentario);

// Rutas exclusivas para administradores
router.get('/', [verificarToken, esAdmin], ticketController.getTodosTiquets);
router.put('/:id', [verificarToken, esAdmin], ticketController.actualizarTiquet);
router.delete('/:id', [verificarToken, esAdmin], ticketController.eliminarTiquet);

module.exports = router;
