const db = require('../models');
const Usuario = db.Usuario;
const puppeteer = require('puppeteer');
const cheerio = require('cheerio'); // Opcional: para procesar el HTML

async function scrapClientsWithPuppeteer() {
  // Configuramos el navegador en modo headless, útil en ambientes de Docker
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Opcional: establecer un user agent similar al de Postman o Chrome
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Navegar a la URL de scraping
  await page.goto('http://www.autocasionmallorca.net/informe/clientes?', { waitUntil: 'networkidle2' });

  // Obtener el contenido HTML de la página
  const content = await page.content();

  await browser.close();

  // Si la información está dentro de una etiqueta <pre> puedes extraerla usando Cheerio
  const $ = cheerio.load(content);
  let rawData = $('pre').html();
  if (!rawData) {
    // Si no existe <pre>, usa el contenido completo o ubica el selector que contenga los datos
    rawData = content;
  }

  // Realizar ajustes en las entidades HTML, en caso de necesitarlo
  rawData = rawData.replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&amp;/g, '&');

  return rawData;
}

// Ejemplo de uso dentro de tu controlador
exports.syncClients = async (req, res) => {
  console.log('Iniciando sincronización de clientes con Puppeteer...');
  let rawData = '';
  try {
    rawData = await scrapClientsWithPuppeteer();
    if (!rawData) {
      throw new Error('No se han obtenido datos con Puppeteer');
    }

    // Procesa los datos: suponiendo que están separados por <br> y cada línea contiene los datos del cliente
    const clientsData = rawData.split('<br>').filter(line => line.trim());
    console.log(`Procesando ${clientsData.length} registros de clientes...`);
    const results = await procesarClientes(clientsData);

    return res.status(200).json({
      success: true,
      message: 'Sincronización completada mediante Puppeteer',
      stats: {
        updated: results.updatedClients.length,
        new: results.newClients.length,
        errors: results.errors.length
      },
      updatedClients: results.updatedClients,
      newClients: results.newClients,
      errors: results.errors
    });

  } catch (error) {
    console.error('Error en la sincronización:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al sincronizar clientes usando Puppeteer',
      error: error.message
    });
  }
};

async function procesarClientes(clientsData) {
  // Estadísticas de resultados
  const updatedClients = [];
  const newClients = [];
  const errors = [];
  
  // Recorrer cada línea de cliente
  for (const clientLine of clientsData) {
    try {
      // Separar campos (formato: codcli|nombre|nif|direccion|email)
      const [codcli, nombre, nif, direccion, email] = clientLine.split('|');
      
      // Ignorar líneas sin datos esenciales
      if (!codcli || !nombre) {
        errors.push(`Línea ignorada por falta de datos: ${clientLine}`);
        continue;
      }
      
      // Verificar si el cliente ya existe
      const existingClient = await Usuario.findOne({ where: { codcli } });
      
      if (existingClient) {
        // Actualizar cliente existente
        const updateData = {};
        if (nombre) updateData.nombre = nombre;
        if (nif) updateData.nif = nif;
        if (direccion) updateData.direccion = direccion;
        if (email) updateData.email = email;
        
        await existingClient.update(updateData);
        updatedClients.push({ codcli, nombre });
      } else {
        // Crear nuevo cliente
        const newClient = await Usuario.create({
          codcli,
          nombre,
          nif: nif || null,
          direccion: direccion || null,
          email: email || `cliente-${codcli}@corsoft.auto`,
          password: 'password123', // El modelo se encarga de hashear la contraseña
          rol: 'usuario'
        });
        newClients.push({ codcli, nombre });
      }
    } catch (clientError) {
      console.error(`Error procesando cliente: ${clientLine}`, clientError);
      errors.push(`Error en cliente ${clientLine}: ${clientError.message}`);
    }
  }
  
  console.log(`Procesamiento completado: ${updatedClients.length} actualizados, ${newClients.length} nuevos, ${errors.length} errores`);
  return { updatedClients, newClients, errors };
}
