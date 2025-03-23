const { Client } = require("pg");

const query = async (queryObject) => {
  console.log(process.env.POSTGRES_PASSWORD);
  const client = new Client({
    host: "localhost",
    port: 5431,
    user: "postgres",
    database: "postgres",
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  const result = await client.query(queryObject);
  await client.end();
  return result;
};

module.exports = { query };
