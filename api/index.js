const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Web Scraper API');
});

app.post('/create', async (req, res) => {
    const name = req.body.name;
    const url = req.body.url;
    const selectors = req.body.selectors;
    if (!name || !url || !selectors) {
        return res.status(400).json({ error: 'Missing name, url, or selectors in request body' });
    }
    const { data, error } = await supabase.from('scrapers').insert([{ name, url, selectors }], { returning: 'minimal' });
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Missing id in request body' });
    }
    const { data, error } = await supabase.from('scrapers').delete().eq('id', id);
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.post('/start/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Missing id in request body' });
    }
    const { data, error } = await supabase.functions.invoke('scraper', { body: { id } });
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.get('/outputs/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Missing id in request params' });
    }
    const { data, error } = await supabase.from('outputs').select().eq('scraper_id', id);
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));