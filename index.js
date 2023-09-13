// Import required modules
import { createTable, closeDatabase } from './database.js';
import crawlWebsite from './crawler.js';

// Define the website to crawl
const website = "http://worrydream.com/refs/";

// Create table in the database
createTable();

console.log("URL: ", website);
crawlWebsite(website).then(() => {
    // Close the database after crawling is done
    closeDatabase();
});