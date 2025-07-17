// para leer las variables de entorno desde un archivo .env
import dotenv from 'dotenv';
// importamos el sql para hacer la conexión 
import mysql from 'mysql2/promise';

dotenv.config();

// creamos la conexión a la db, con pool para manejar varias conexiones
// Use pool porque es una buena práctica para manejar conexiones a la base de datos y por probar
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
 
// probamos la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a la base de datos MySQL');
    connection.release(); // Liberamos la conexión
  } catch (err) {
    console.log('Error de conexión a la base de datos:', err);
  }
}

testConnection();

// la exportamos para usarla en otros archivos
export default pool;
