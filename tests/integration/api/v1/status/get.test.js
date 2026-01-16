test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const postgresVer = await responseBody.dependencies.database.postgres_ver;
  expect(postgresVer).toEqual("16.0");

  const maxConections =
    await responseBody.dependencies.database.max_connections;
  expect(maxConections).toEqual(100);

  const currentConections =
    await responseBody.dependencies.database.opened_connections;
  expect(currentConections).toBe(1);
});
