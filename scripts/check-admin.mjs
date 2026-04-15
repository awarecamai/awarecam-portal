import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const url = new URL(process.env.DATABASE_URL);
const conn = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1).split('?')[0],
  ssl: { rejectUnauthorized: true }
});

const [rows] = await conn.query("SELECT id, email, role, portalRole, passwordHash, loginMethod FROM users WHERE email = 'yehoshua@awarecam.com'");
if (!rows[0]) {
  console.log('User not found');
  process.exit(1);
}
const u = rows[0];
console.log('id:', u.id);
console.log('email:', u.email);
console.log('role:', u.role);
console.log('portalRole:', u.portalRole);
console.log('loginMethod:', u.loginMethod);
console.log('passwordHash exists:', !!u.passwordHash);

if (u.passwordHash) {
  const match = await bcrypt.compare('AwareCam2024Admin', u.passwordHash);
  console.log('Password "AwareCam2024Admin" matches:', match);
}

await conn.end();
