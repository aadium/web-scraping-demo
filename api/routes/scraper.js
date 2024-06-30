const express = require('express');
const Sentiment = require('sentiment');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middlewares/auth');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const router = express.Router();
const sentiment = new Sentiment();

router.get('/', authMiddleware, async (req, res) => {
    const uid = req.auth.user.id;
    if (!uid) {
        return res.status(400).json({ error: 'Missing uid in request params' });
    }
    const { data, error } = await supabase.from('scrapers').select().eq('uid', uid);
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

router.get('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Missing id in request params' });
    }
    const { data, error } = await supabase.from('scrapers').select().eq('id', id).single();
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

router.post('/create', authMiddleware, async (req, res) => {
    const uid = req.auth.user.id;
    const name = req.body.name;
    const url = req.body.url;
    const selectors = req.body.selectors;
    if (!name || !url || !selectors) {
        return res.status(400).json({ error: 'Missing name, url, or selectors in request body' });
    }
    const { data, error } = await supabase.from('scrapers').insert([{ uid, name, url, selectors }], { returning: 'minimal' });
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

router.delete('/:id', authMiddleware, async (req, res) => {
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

router.post('/start/:id', authMiddleware, async (req, res) => {
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

router.get('/outputs/:id', authMiddleware, async (req, res) => {
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

router.get('/output/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Missing id in request params' });
    }
    const { data, error } = await supabase.from('outputs').select().eq('id', id).single();
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    const bucket_url = data.bucket_url;
    const output_data = await fetch(bucket_url).then(res => res.json());
    res.json(output_data);
});

router.post('/sentiment', (req, res) => {
    const data = req.body.data;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'No data provided or data is not an array' });
    }

    const results = data.map(item => {
        const textFields = Object.keys(item).filter(key => typeof item[key] === 'string');
        const sentimentResults = textFields.map(field => {
            const text = item[field];
            if (!text) {
                return null;
            }
            if (text.length === 0) {
                return null;
            }
            if (text.length > 5000) {
                return null;
            }
            const analysis = sentiment.analyze(text);
            let result = {
                field: field,
                text: text,
                score: analysis.score,
            };
            if (analysis.positive.length > 0) {
                result.positive = analysis.positive;
            };
            if (analysis.negative.length > 0) {
                result.negative = analysis.negative;
            };
            return result;
        }).filter(result => result !== null);
        return sentimentResults;
    });

    res.json(results);
});

module.exports = router;