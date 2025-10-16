export default {
  url: process.env.DATABASE_URL || "mysql://avnadmin:AVNS_WZhxQ4IMKE0YxL99W4O@mysql-15379d01-phuphanbdb.d.aivencloud.com:20142/defaultdb?ssl-mode=REQUIRED",
  dialect: process.env.DATABASE_DIALECT || "mysql",
  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },
};