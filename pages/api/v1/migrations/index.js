import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import { error } from "node:console";

const migrations = async (req, res) => {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return res.status(200).json(pendingMigrations);
    }

    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations);
      }

      return res.status(200).json(migratedMigrations);
    }
  } catch (e) {
    console.error(e);
    throw error;
  } finally {
    await dbClient.end();
  }
};

export default migrations;
