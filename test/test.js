require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

supabase.functions.invoke('scraper', { body: { id: '93f272d3-b2db-42df-b89d-d45843f28ca7' }})
    .then(({ data, error }) => {
        console.log(data)
    });