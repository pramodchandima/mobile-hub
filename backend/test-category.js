const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // default in authController?

const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
console.log('Test Token generated:', token);

const testUpload = async () => {
    const FormData = require('form-data');
    const fetch = require('node-fetch'); // wait node-fetch might not be installed, better use native http or axios. Actually Node 18+ has fetch.
    const form = new FormData();
    form.append('name', 'Test Cat');
    form.append('description', 'A test category');

    try {
        const res = await fetch('http://localhost:5000/api/admin/categories', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });
        const data = await res.json();
        console.log('Response:', data);
    } catch (e) {
        console.error('Fetch error:', e);
    }
};
testUpload();
