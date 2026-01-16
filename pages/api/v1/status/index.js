import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const getPostgresVer = await database.query("SHOW server_version;");
  const postgresVer = getPostgresVer.rows[0].server_version;

  const getMaxConnections = await database.query("SHOW max_connections;");
  const maxConections = getMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const getOpenConnections = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const openedConnections = getOpenConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_ver: postgresVer,
        max_connections: parseInt(maxConections),
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
