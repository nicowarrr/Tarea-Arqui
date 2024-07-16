// middleware/auth.js
const db = require('../database');

function authenticateCompany(req, res, next) {
    const apiKey = req.headers['company_api_key'] || req.query.company_api_key;
    if (!apiKey) {
        return res.status(401).json({ error: 'company_api_key is required' });
    }

    db.get('SELECT id FROM company WHERE company_api_key = ?', [apiKey], (err, row) => {
        if (err || !row) {
            return res.status(401).json({ error: 'Invalid company_api_key' });
        }
        req.companyId = row.id;
        next();
    });
}

module.exports = {
    authenticateCompany,
};

