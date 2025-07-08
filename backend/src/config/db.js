//para leer las variables de entorno desde un archivo .env
require('dotenv').config();

//importamos el sql pa hacer la coneccion 
const mysql = require('mysql2/promise');

//creamos la conexion a la db, con pool para manejar varias conexiones
//Use pool porque es una buena practica para manejar conexiones a la base de datos y por probar
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
  if (err) { 
    console.log('Error de conexion a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
  connection.release(); // Liberamos la conexión
});

//la exportamos para usarla en otros archivos
module.exports = pool;

