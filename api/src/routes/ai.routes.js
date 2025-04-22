const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { sequelize, connectWithRetry } = require('../config/database');
const { Sequelize } = require('sequelize');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// Almacenamiento en memoria para conversaciones (en producción usarías Redis o una base de datos)
const conversationHistory = new Map();

// POST /api/ai/query-sql
router.post('/query-sql', [verificarToken, esAdmin], async (req, res) => {
  const { prompt, conversationId = Date.now().toString() } = req.body;
  
  // Recuperar o inicializar historial de conversación
  if (!conversationHistory.has(conversationId)) {
    conversationHistory.set(conversationId, []);
  }
  
  const history = conversationHistory.get(conversationId);
  
  // Añadir mensaje de usuario al historial
  history.push({ role: 'user', content: prompt });
  
  try {
    // Ensure DB connection and fetch schema for context
    await connectWithRetry();
    const tables = await sequelize.query(
      `SELECT TABLE_NAME, GROUP_CONCAT(CONCAT(COLUMN_NAME, ' ', COLUMN_TYPE) ORDER BY ORDINAL_POSITION SEPARATOR ', ') AS columns FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = :schema GROUP BY TABLE_NAME`,
      { replacements: { schema: process.env.DB_NAME }, type: Sequelize.QueryTypes.SELECT }
    );
    const schemaDescription = tables.map(t => `Table ${t.TABLE_NAME}: ${t.columns}`).join('\n');
    // Generate SQL via OpenAI SDK with DB context
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Crear mensajes con sistema + historial de conversación
    const systemMessage = { role: 'system', content: `You are a SQL assistant with access to the following database schema:\n${schemaDescription}\nGiven a natural language request, return only the SQL query. db_name = tiquets_db` };
    const messages = [systemMessage, ...history.slice(-5)]; // Últimos 5 mensajes para mantener contexto
    const completion = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages, temperature: 0 });
    const sqlQuery = completion.choices[0].message.content.trim();
    
    // Añadir respuesta de IA al historial
    history.push({ role: 'assistant', content: sqlQuery });
    
    // Execute SQL using Sequelize
    const [rows] = await sequelize.query(sqlQuery);
    
    // Interpret query results into natural language
    const interpretMessages = [
      { role: 'system', content: 'Eres un asistente útil. Dada una consulta SQL y su conjunto de resultados, proporciona una explicación concisa en español y presenta los datos en una tabla Markdown.' },
      { role: 'user', content: `SQL Query: ${sqlQuery}\nResult: ${JSON.stringify(rows)}` }
    ];
    
    const interpretCompletion = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages: interpretMessages, temperature: 0 });
    const naturalAnswer = interpretCompletion.choices[0].message.content.trim();
    
    // Añadir interpretación al historial
    history.push({ role: 'assistant', content: naturalAnswer });
    
    // Guardar historial actualizado
    conversationHistory.set(conversationId, history);
    
    res.json({
      success: true,
      sql: sqlQuery,
      answer: naturalAnswer,
      rows,
      conversationId
    });
  } catch (error) {
    console.error('AI query error:', error);
    
    // Intento de recuperación con enfoque alternativo
    if (error.message.includes('syntax error') || error.name === 'SequelizeDatabaseError') {
      try {
        console.log('Intentando consulta con enfoque alternativo...');
        
        // Añadir mensaje de error al historial
        history.push({
          role: 'assistant',
          content: `Error al ejecutar la consulta: ${error.message}. Intentaré un enfoque alternativo.`
        });
        
        // Enfoque alternativo: pedir a la IA que corrija la consulta
        const correctionMessages = [
          { role: 'system', content: `Eres un experto SQL. La siguiente consulta generó un error: "${error.message}". Por favor, corrige la consulta y devuelve SOLO el SQL corregido sin explicaciones.` },
          { role: 'user', content: prompt }
        ];
        
        const correctionCompletion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: correctionMessages,
          temperature: 0
        });
        
        const correctedQuery = correctionCompletion.choices[0].message.content.trim();
        
        // Ejecutar la consulta corregida
        const [rows] = await sequelize.query(correctedQuery);
        
        // Interpretar resultados
        const interpretMessages = [
          { role: 'system', content: 'Eres un asistente útil. Dada una consulta SQL y su conjunto de resultados, proporciona una explicación concisa en español y presenta los datos en una tabla Markdown.' },
          { role: 'user', content: `SQL Query (corregida): ${correctedQuery}\nResult: ${JSON.stringify(rows)}` }
        ];
        
        const interpretCompletion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: interpretMessages,
          temperature: 0
        });
        
        const naturalAnswer = interpretCompletion.choices[0].message.content.trim();
        
        // Añadir respuesta al historial
        history.push({ role: 'assistant', content: naturalAnswer });
        
        // Guardar historial y responder
        conversationHistory.set(conversationId, history);
        return res.json({
          success: true,
          sql: correctedQuery,
          answer: naturalAnswer,
          rows,
          recovered: true,
          conversationId
        });
      } catch (recoveryError) {
        console.error('Error en recuperación de consulta:', recoveryError);
        res.status(500).json({
          success: false,
          error: 'No se pudo recuperar de un error en la consulta SQL.',
          originalError: error.message,
          recoveryError: recoveryError.message
        });
      }
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// GET /api/ai/conversations/:id
router.get('/conversations/:id', [verificarToken, esAdmin], (req, res) => {
  const { id } = req.params;
  
  if (!conversationHistory.has(id)) {
    return res.status(404).json({ success: false, error: 'Conversación no encontrada' });
  }
  
  res.json({
    success: true,
    history: conversationHistory.get(id)
  });
});

// DELETE /api/ai/conversations/:id
router.delete('/conversations/:id', [verificarToken, esAdmin], (req, res) => {
  const { id } = req.params;
  
  if (!conversationHistory.has(id)) {
    return res.status(404).json({ success: false, error: 'Conversación no encontrada' });
  }
  
  conversationHistory.delete(id);
  res.json({ success: true, message: 'Conversación eliminada' });
});

module.exports = router;
