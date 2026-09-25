const express = require('express');

const pool = require('../config/database');

const router = express.Router();

async function elencaGeneri(req, res) {
    const [righe] = await pool.query('SELECT id, nome FROM genere ORDER BY nome');
    res.json(righe);
}

router.get('/generi', elencaGeneri);

module.exports = router;
