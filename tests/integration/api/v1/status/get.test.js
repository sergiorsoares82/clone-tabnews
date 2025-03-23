const database = require("../../../../../infra/database");

test("GET /api/v1/status should return 200", async () => {
  const result = await database.query("Select 1 + 1 as sum");
  console.log(result.rows[0].sum);
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});
