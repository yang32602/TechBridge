import db from './src/config/db.js';

async function testEmpresasTable() {
  try {
    console.log('Testing empresas table...');
    
    // Check table structure
    const [structure] = await db.query('DESCRIBE empresas');
    console.log('Table structure:', structure);
    
    // Check if there are any records
    const [records] = await db.query('SELECT * FROM empresas LIMIT 5');
    console.log('Sample records:', records);
    
    // Check for id = 1 specifically
    const [specific] = await db.query('SELECT * FROM empresas WHERE id = 1');
    console.log('Record with id=1:', specific);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testEmpresasTable();
