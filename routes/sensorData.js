// routes/sensorData.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Insert sensor data
router.post('/', (req, res) => {
    const { api_key, json_data } = req.body;

    db.get('SELECT id FROM sensor WHERE sensor_api_key = ?', [api_key], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: 'Invalid API key' });
        }
        const sensor_id = row.id;
        const timestamp = Math.floor(Date.now() / 1000);

        json_data.forEach(data => {
            db.run('INSERT INTO sensor_data (sensor_id, data, timestamp) VALUES (?, ?, ?)', [sensor_id, JSON.stringify(data), timestamp]);
        });

        res.status(201).json({ message: 'Data inserted successfully' });
    });
});

// Query sensor data
router.get('/', (req, res) => {
    const { company_api_key, from, to, sensor_id } = req.query;

    db.get('SELECT id FROM company WHERE company_api_key = ?', [company_api_key], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: 'Invalid company API key' });
        }
        
        const sensorIds = sensor_id.split(',').map(id => parseInt(id, 10));
        const query = `SELECT * FROM sensor_data WHERE sensor_id IN (${sensorIds.join(',')}) AND timestamp BETWEEN ? AND ?`;
        
        db.all(query, [from, to], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });
});
// Delete sensor data
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM sensor_data WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Sensor data not found' });
        }
        res.status(200).json({ message: 'Sensor data deleted successfully' });
    });
});

// Update sensor data
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body; // Assuming the new data is sent in the body

    db.run('UPDATE sensor_data SET data = ? WHERE id = ?', [JSON.stringify(data), id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Sensor data not found' });
        }
        res.status(200).json({ message: 'Sensor data updated successfully' });
    });
});

module.exports = router;
