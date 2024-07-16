// routes/location.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateCompany } = require('../middleware/auth');

router.use(authenticateCompany);

// Get all locations
router.get('/', (req, res) => {
    db.all('SELECT * FROM location WHERE company_id = ?', [req.companyId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { company_id, location_name, location_country, location_city, location_meta } = req.body;

    db.run('INSERT INTO location (company_id, location_name, location_country, location_city, location_meta) VALUES (?, ?, ?, ?, ?)', 
        [company_id, location_name, location_country, location_city, location_meta], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, location_name, location_country, location_city, location_meta,company_id });
    });
});

// Get a single location
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM location WHERE id = ? AND company_id = ?', [id, req.companyId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(row);
    });
});

// Update a location
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { location_name, location_country, location_city, location_meta } = req.body;

    db.run('UPDATE location SET location_name = ?, location_country = ?, location_city = ?, location_meta = ? WHERE id = ? AND company_id = ?', 
        [location_name, location_country, location_city, location_meta, id, req.companyId], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ error: 'Location not found or no changes made' });
        }
        res.json({ message: 'Location updated successfully' });
    });
});

// Delete a location
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM location WHERE id = ? AND company_id = ?', [id, req.companyId], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json({ message: 'Location deleted successfully' });
    });
});

module.exports = router;

