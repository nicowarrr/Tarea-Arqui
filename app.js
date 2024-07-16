// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

const companyRoutes = require('./routes/company');
const locationRoutes = require('./routes/location');
const sensorRoutes = require('./routes/sensor');
const sensorDataRoutes = require('./routes/sensorData');

app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/sensor', sensorRoutes);
app.use('/api/v1/sensor_data', sensorDataRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

