import database from "infra/database.js";
import { ValidationError } from "infra/errors";

const create = async (userInputValues) => {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT 
          * 
        FROM 
          users 
        WHERE 
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      console.log("throw validation error");
      throw new ValidationError({
        message: "O email informado já está em uso.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
        SELECT 
          * 
        FROM 
          users 
        WHERE 
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      console.log("throw validation error");
      throw new ValidationError({
        message: "O nome de usuário informado já está em uso.",
        action: "Utilize outro nome de usuário para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          users (username, email, password) 
        VALUES 
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
};

const user = {
  create,
};

export default user;
