const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  try {
    await client.query('UPDATE "Product" SET "imageUrl" = NULL');
    console.log("All product image URLs have been reset to NULL.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
