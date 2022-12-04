module.exports = {
  type: 'mysql',
  port: 3306,
  host: process.env.DB_ENDPOINT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  synchronize: false,
  cache: false,
  migrationsRun: true,
  charset: 'utf8mb4_unicode_ci',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  "migrations": [
      "dist/orm/migration/**/*.js"
   ],
   "subscribers": [
      "dist/orm/subscriber/**/*.js"
   ],
   "cli": {
      "migrationsDir": "src/orm/migration",
      "subscribersDir": "src/orm/subscriber"
   }
}