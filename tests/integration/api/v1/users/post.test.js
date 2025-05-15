import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "unique_username",
          email: "unique_usermane@email.com",
          password: "password",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique_username",
        email: "unique_usermane@email.com",
        password: "password",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicated_email1",
          email: "duplicated@email.com",
          password: "password",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicated_email2",
          email: "Duplicated@email.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();
      await expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já está em uso.",
        action: "Utilize outro email para realizar o cadastro.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicated_username",
          email: "duplicated@username.com",
          password: "password",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Duplicated_Username",
          email: "duplicated2@username.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();
      await expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O nome de usuário informado já está em uso.",
        action: "Utilize outro nome de usuário para realizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
