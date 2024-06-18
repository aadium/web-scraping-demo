const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const { data: data, error } = await supabase.auth.getUser(token);
    if (error || !data) {
        console.error(error || 'No user');
        return res.status(403).json({ error: 'Not authenticated' });
    }
    req.auth = data;
    next();
};

module.exports = authMiddleware;