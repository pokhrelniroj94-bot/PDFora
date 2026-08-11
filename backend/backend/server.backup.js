const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary folders बनाउने (यदि छैनन् भने)
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
if (!fs.existsSync('./processed')) fs.mkdirSync('./processed');

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'PDFora Backend is running successfully! 🚀' });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});