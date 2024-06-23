const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middlewares/auth');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const router = express.Router();

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

router.get('/output/:id', authMiddleware, async (req, res) => {
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

module.exports = router;