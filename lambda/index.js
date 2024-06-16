const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeUrl(url, selectors) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const scrapedData = [];
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

const url = 'https://techcrunch.com/';
const selectors = {
    title: 'h2.wp-block-post-title',
    author: 'div.wp-block-tc23-author-card-name'
};

scrapeUrl(url, selectors)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(error => console.error(error));

exports.handler = async (event, context) => {
    try {
        const data = await scrapeUrl(url, selectors);
        console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
};