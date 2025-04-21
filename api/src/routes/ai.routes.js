const express = require('express');
const router = express.Router();
const { OpenAI } = require('langchain/llms/openai');
const { SQLDatabase } = require('langchain/sql_db');
const { SQLDatabaseChain } = require('langchain/chains');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// POST /api/ai/query-sql
router.post('/query-sql', [verificarToken, esAdmin], async (req, res) => {
  const { prompt } = req.body;
  try {
    // Inicializar LLM y conexión a la base de datos
    const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0 });
    const dbUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`;
    const db = await SQLDatabase.fromUri(dbUrl);
    const chain = SQLDatabaseChain.fromLLM(llm, db, { verbose: false });
    // Ejecutar consulta
    const result = await chain.call({ query: prompt });
    res.json({ success: true, sql: result.sql_query, answer: result.text });
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
