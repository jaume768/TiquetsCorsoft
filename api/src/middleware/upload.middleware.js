const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Determinar si es para un comentario o un ticket
    const isComentario = req.path.includes('/comentarios');
    const ticketId = req.params.id || req.body.id || 'temp';
    
    // Definir el directorio base según si es comentario o ticket
    let uploadDir;
    if (isComentario) {
      // Para comentarios, usamos un directorio temporal ya que aún no tenemos el ID del comentario
      // (se moverá después al directorio correcto en el controlador)
      uploadDir = path.join(__dirname, '../../uploads/temp');
    } else {
      // Para tickets, usamos el directorio del ticket
      uploadDir = path.join(__dirname, '../../uploads/tickets', ticketId.toString());
    }
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generar nombre único con timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileName = `${timestamp}_${originalName}`;
    
    cb(null, fileName);
  }
});

// Configurar filtro
const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/zip'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Exportar middleware multer configurado
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
