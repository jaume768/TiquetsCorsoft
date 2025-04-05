// Configuración de la base de datos
const { Sequelize } = require('sequelize');

// Crear instancia de Sequelize con retry de conexión
const createSequelizeInstance = () => {
  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      retry: {
        max: 10,
        match: [
          /ETIMEDOUT/,
          /ECONNREFUSED/,
          /PROTOCOL_CONNECTION_LOST/,
          /ENOTFOUND/
        ],
        backoffBase: 1000,
        backoffExponent: 1.5
      }
    }
  );
};

const sequelize = createSequelizeInstance();

// Función para intentar conectarse a la base de datos con reintentos
const connectWithRetry = async (retries = 5, delay = 5000) => {
  let currentRetry = 0;
  
  while (currentRetry < retries) {
    try {
      await sequelize.authenticate();
      console.log('Conexión a la base de datos establecida con éxito.');
      return true;
    } catch (error) {
      currentRetry++;
      console.error(`Intento ${currentRetry}/${retries} - Error al conectar a la base de datos:`, error.message);
      
      if (currentRetry >= retries) {
        console.error('Número máximo de reintentos alcanzado. No se pudo conectar a la base de datos.');
        throw error;
      }
      
      console.log(`Reintentando en ${delay/1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = {
  sequelize,
  connectWithRetry
};
