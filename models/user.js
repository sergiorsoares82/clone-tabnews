import database from "infra/database.js";
import { NotFoundError, ValidationError } from "infra/errors";
import password from "./password";

const findOneByUsername = async (username) => {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(username) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username foi digitado corretamente.",
      });
    }

    return results.rows[0];
  }
};

const findOneByEmail = async (email) => {
  const userFound = await runSelectQuery(email);
  return userFound;

  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(email) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email foi digitado corretamente.",
      });
    }

    return results.rows[0];
  }
};

const create = async (userInputValues) => {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const newUser = runInsertQuery(userInputValues);
  return newUser;
};

const update = async (username, userInputValues) => {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithUpdatedValues = {
    ...currentUser,
    ...userInputValues,
  };

  const updatedUser = await runUpdateQuery(userWithUpdatedValues);

  return updatedUser;

  async function runUpdateQuery(userWithUpdatedValues) {
    const results = await database.query({
      text: `
        UPDATE 
          users 
        SET 
          username = $1, 
          email = $2, 
          password = $3,
          updated_at = timezone('UTC', now())
        WHERE 
          id = $4
        RETURNING
          *
        ;`,
      values: [
        userWithUpdatedValues.username,
        userWithUpdatedValues.email,
        userWithUpdatedValues.password,
        userWithUpdatedValues.id,
      ],
    });

    return results.rows[0];
  }
};

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
      action: "Utilize outro nome de usuário para realizar esta operação.",
    });
  }
}

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
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
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

const user = {
  create,
  findOneByEmail,
  findOneByUsername,
  update,
};

export default user;
