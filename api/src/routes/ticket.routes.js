const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif)'));
  }
});

// Rutas para todos los usuarios (autenticados)
router.get('/mis-tiquets', verificarToken, ticketController.getMisTiquets);
router.post('/', verificarToken, upload.single('imagen'), ticketController.crearTiquet);
router.get('/:id', verificarToken, ticketController.getTiquetPorId);

// Rutas exclusivas para administradores
router.get('/', [verificarToken, esAdmin], ticketController.getTodosTiquets);
router.put('/:id', [verificarToken, esAdmin], ticketController.actualizarTiquet);
router.delete('/:id', [verificarToken, esAdmin], ticketController.eliminarTiquet);

module.exports = router;
