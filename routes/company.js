// routes/company.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const uuid = require('uuid');

// Create a new company
router.post('/', (req, res) => {
    const { company_name } = req.body;
    const company_api_key = uuid.v4();

    db.run('INSERT INTO company (company_name, company_api_key) VALUES (?, ?)', [company_name, company_api_key], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, company_name, company_api_key });
    });
});

// Get all companies
router.get('/', (req, res) => {
    db.all('SELECT * FROM company', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Delete a company
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM company WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    });
});

// Update a company
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { company_name } = req.body;

    db.run('UPDATE company SET company_name = ? WHERE id = ?', [company_name, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json({ message: 'Company updated successfully' });
    });
});
module.exports = router;
