// Import required modules
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { insertData } from './database.js';
import path from 'path';

async function downloadPDF(url, filename) {
    console.log(`Starting download of PDF from ${url}`);
    const dir = path.dirname(filename);

    // Check if directory exists, if not create it
    if (!fs.existsSync(dir)) {
        console.log(`Directory ${dir} does not exist, creating it`);
        fs.mkdirSync(dir, { recursive: true });
    }

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(filename);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log(`Finished downloading PDF from ${url}`);
            resolve();
        });
        writer.on('error', (error) => {
            console.log(`Error downloading PDF from ${url}: ${error}`);
            reject();
        });
    });
}

// Function to crawl website
async function crawlWebsite(url) {
    console.log(`Starting to crawl website ${url}`);
    // Use axios to make HTTP request to the website
    const response = await axios.get(url);

    // Parse HTML using cheerio to extract links
    const $ = cheerio.load(response.data);
    const links = $('a');
    // For each link, visit the page and crawl it
    for (let i = 0; i < links.length; i++) {
        let element = links[i];
        let linkUrl = $(element).attr('href');

        // Check if the link is a relative URL
        if (!linkUrl.startsWith('http')) {
            console.log(`Link ${linkUrl} is a relative URL, converting it to absolute`);
            linkUrl = new URL(linkUrl, url).href;
        }

        // Check if the link is a PDF
        if (linkUrl.endsWith('.pdf')) {
            console.log(`Link ${linkUrl} is a PDF, starting to process it`);
            // Extract the name of the PDF from the URL, capitalize it and replace hyphens and underscores with spaces
            let name = linkUrl.split('/').pop().split('.')[0];
            name = decodeURIComponent(name.replace(/[-_]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
            const filename = `./pdfs/${name}.pdf`;

            // Download PDF
            await downloadPDF(linkUrl, filename);

            const metadata = {
                filename: filename,
                url: linkUrl,
                name: name,
                downloadTime: new Date().toISOString()
            };

            // const vector = 'Dummy vector';

            // Store data in SQLite database
            console.log(`Storing data for PDF ${linkUrl} in the database`);
            insertData(linkUrl, metadata);
            // insertData(linkUrl, metadata, vector);
        } else {
            // If the link is not a PDF, crawl the page
            console.log(`Link ${linkUrl} is not a PDF, skipping`);
            // await crawlWebsite(linkUrl);
        }
        ``
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

export default crawlWebsite;
