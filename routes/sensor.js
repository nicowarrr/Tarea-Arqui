// routes/sensor.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateCompany } = require('../middleware/auth');
const uuid = require('uuid');

router.use(authenticateCompany);

// Create a new sensor
router.post('/', (req, res) => {
    const { location_id, sensor_name, sensor_category, sensor_meta } = req.body;
    const sensor_api_key = uuid.v4();

    db.run('INSERT INTO sensor (location_id, sensor_name, sensor_category, sensor_meta, sensor_api_key) VALUES (?, ?, ?, ?, ?)', 
        [location_id, sensor_name, sensor_category, sensor_meta, sensor_api_key], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, location_id, sensor_name, sensor_category, sensor_meta, sensor_api_key });
    });
});

// Get all sensors
router.get('/', (req, res) => {
    db.all('SELECT * FROM sensor WHERE location_id IN (SELECT id FROM location WHERE company_id = ?)', [req.companyId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get a single sensor
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM sensor WHERE id = ? AND location_id IN (SELECT id FROM location WHERE company_id = ?)', [id, req.companyId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Sensor not found' });
        }
        res.json(row);
    });
});

// Update a sensor
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { sensor_name, sensor_category, sensor_meta } = req.body;

    db.run('UPDATE sensor SET sensor_name = ?, sensor_category = ?, sensor_meta = ? WHERE id = ? AND location_id IN (SELECT id FROM location WHERE company_id = ?)', 
        [sensor_name, sensor_category, sensor_meta, id, req.companyId], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ error: 'Sensor not found or no changes made' });
        }
        res.json({ message: 'Sensor updated successfully' });
    });
});

// Delete a sensor
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM sensor WHERE id = ? AND location_id IN (SELECT id FROM location WHERE company_id = ?)', [id, req.companyId], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ error: 'Sensor not found' });
        }
        res.json({ message: 'Sensor deleted successfully' });
    });
});

module.exports = router;
