export default {
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "PLEASE INPUT DATABASE PORT HERE", 10),
    username: process.env.DATABASE_USER || "PLEASE INPUT DATABASE USER HERE",
    password: process.env.DATABASE_PASSWORD || "PLEASE INPUT DATABASE USER PASSWORD HERE",
    database: process.env.DATABASE_DATABASE || "PLEASE INPUT DATABASE NAME HERE",
    logging: ["error"],
  
    // TODO: Enable migrations before production
    synchronize: true,
  
    // IMPORTANT: Path should be relative to root
    entities: ["./api/models/**/*.ts"],
    cli: {
      // IMPORTANT: Path should be relative to root
      entitiesDir: "./api/models"}
  };
  