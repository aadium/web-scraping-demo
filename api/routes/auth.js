const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const router = express.Router();

router.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password in request body' });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ token: data.session.access_token, user: data.user });
});

router.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password in request body' });
    }
    const { user, session, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json({ user, session });
});

router.post('/signout', async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Logged out' });
});

module.exports = router;