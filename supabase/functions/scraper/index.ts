import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { cheerio } from "https://deno.land/x/denocheerio/mod.ts";

async function scrapeUrl(
    url: string,
    selectors: { title: string; author: string }
)   {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const $ = cheerio.load(text);

        const scrapedData: { title: string; author: string }[] = [];
        $(selectors.title).each((index, element) => {
        const title = $(element).text().trim();
        const author = $(selectors.author).eq(index).text().trim();
        scrapedData.push({ title, author });
        });

        return scrapedData;
    } catch (error) {
        return { error: error.message };
    }
}

async function fetchData(id: string) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
        .from('scrapers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }

    const { url, selectors } = data;

    try {
        const scrapedData = await scrapeUrl(url, selectors);
        console.log(JSON.stringify(scrapedData, null, 2));

        const fileName = `${id}_${Date.now()}.json`;
        const { error: uploadError } = await supabase.storage
            .from('outputs')
            .upload(fileName, new Blob([JSON.stringify(scrapedData)]), { contentType: 'application/json' });

        if (uploadError) {
            console.error('Upload Error', JSON.stringify(uploadError, null, 2));
            throw uploadError;
        }

        const bucketUrl = `${supabaseUrl}/storage/v1/object/public/outputs/${fileName}`;

        const { error: insertError } = await supabase
            .from('outputs')
            .insert([{ scraper_id: id, bucket_url: bucketUrl }]);

        if (insertError) {
            console.error('Insertion Error' + JSON.stringify(insertError, null, 2));
            throw insertError;
        }

        return new Response(JSON.stringify(scrapedData), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}

Deno.serve(async (req) => {
    const { id } = await req.json();
    return await fetchData(id);
});