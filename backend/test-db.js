const db = require('./src/config/db'); // Ajusta la ruta según tu proyecto

db.query('SELECT 1 + 1 AS resultado', (err, rows) => {
  if (err) {
    console.error('❌ Error al hacer consulta:', err);
  } else {
    console.log('✅ Resultado:', rows[0].resultado); // Debería imprimir 2
  }
});
