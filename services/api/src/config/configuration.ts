export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  uri: process.env.CONNECT_STRING,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
  },
});
