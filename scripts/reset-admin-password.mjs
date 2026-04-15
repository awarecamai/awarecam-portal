import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const NEW_PASSWORD = 'AwareCam2024Admin';

const url = new URL(process.env.DATABASE_URL);
const conn = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1).split('?')[0],
  ssl: { rejectUnauthorized: true }
});

const hash = await bcrypt.hash(NEW_PASSWORD, 12);
const [result] = await conn.query(
  "UPDATE users SET passwordHash = ?, loginMethod = 'email' WHERE email = 'yehoshua@awarecam.com'",
  [hash]
);
console.log('Rows updated:', result.affectedRows);

// Verify
const [rows] = await conn.query("SELECT passwordHash FROM users WHERE email = 'yehoshua@awarecam.com'");
const match = await bcrypt.compare(NEW_PASSWORD, rows[0].passwordHash);
console.log('Password verified:', match);
console.log('Login credentials:');
console.log('  Email:    yehoshua@awarecam.com');
console.log('  Password: AwareCam2024Admin');

await conn.end();
