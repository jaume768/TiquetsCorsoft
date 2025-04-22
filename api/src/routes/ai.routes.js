const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { sequelize, connectWithRetry } = require('../config/database');
const { Sequelize } = require('sequelize');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// POST /api/ai/query-sql
router.post('/query-sql', [verificarToken, esAdmin], async (req, res) => {
  const { prompt } = req.body;
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
    const messages = [
      { role: 'system', content: `You are a SQL assistant with access to the following database schema:\n${schemaDescription}\nGiven a natural language request, return only the SQL query. DB_name: tiquets_db` },
      { role: 'user', content: prompt }
    ];
    const completion = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages, temperature: 0 });
    const sqlQuery = completion.choices[0].message.content.trim();
    // Execute SQL using Sequelize
    const [rows] = await sequelize.query(sqlQuery);
    // Interpret query results into natural language
    const interpretMessages = [
      { role: 'system', content: 'Eres un asistente útil. Dada una consulta SQL y su conjunto de resultados, proporciona una explicación concisa en español y presenta los datos en una tabla Markdown.' },
      { role: 'user', content: `SQL Query: ${sqlQuery}\nResult: ${JSON.stringify(rows)}` }
    ];
    const interpretCompletion = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: interpretMessages, temperature: 0 });
    const naturalAnswer = interpretCompletion.choices[0].message.content.trim();
    res.json({ success: true, sql: sqlQuery, answer: naturalAnswer, rows });
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
