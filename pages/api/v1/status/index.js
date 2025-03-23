import database from "infra/database";

const status = async (req, res) => {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  res.status(200).json({ chave: "são acima da média" });
};

export default status;
