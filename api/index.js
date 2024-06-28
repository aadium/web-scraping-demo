const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const authRoutes = require('./routes/auth');
const scraperRoutes = require('./routes/scraper');

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://scrapify-web.vercel.app'],
}));

app.use('/auth', authRoutes);
app.use('/scraper', scraperRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Web Scraper Demo API' });
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Server running on port ${port}`));