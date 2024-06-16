const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

supabase.functions.invoke('scraper')
    .then(({ data, error }) => {
        console.log(data)
    });