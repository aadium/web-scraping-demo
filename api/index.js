const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const scraperRoutes = require('./routes/scraper');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/scraper', scraperRoutes);

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Server running on port ${port}`));