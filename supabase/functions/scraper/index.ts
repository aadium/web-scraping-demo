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

Deno.serve(async (req) => {
    const url = "https://techcrunch.com/";
    const selectors = {
        title: "h2.wp-block-post-title",
        author: "div.wp-block-tc23-author-card-name",
    };

    try {
        const data = await scrapeUrl(url, selectors);
        console.log(JSON.stringify(data, null, 2));

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);

        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});
