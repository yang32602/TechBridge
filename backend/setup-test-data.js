import db from './src/config/db.js';
import fs from 'fs';

async function setupTestData() {
  try {
    console.log('🔧 Setting up test data...');
    
    // Read the SQL script
    const sqlScript = fs.readFileSync('./test-insert-empresa.sql', 'utf8');
    
    // Split by semicolons and filter out empty statements
    const statements = sqlScript.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement && !trimmedStatement.startsWith('--')) {
        console.log('📝 Executing:', trimmedStatement.substring(0, 50) + '...');
        try {
          await db.query(trimmedStatement);
          console.log('✅ Executed successfully');
        } catch (error) {
          console.log('⚠️ Statement failed (might already exist):', error.message);
        }
      }
    }
    
    // Verify the test data
    console.log('\n🔍 Verifying test data...');
    const [empresas] = await db.query('SELECT * FROM empresas WHERE id = 1');
    const [vacantes] = await db.query('SELECT * FROM vacantes WHERE id_empresa = 1');
    
    console.log('📊 Test empresa:', empresas[0]);
    console.log('📊 Test vacantes:', vacantes.length);
    
    if (empresas.length > 0) {
      console.log('✅ Test data setup completed successfully!');
      console.log('🏢 Empresa ID 1 is now available for testing');
    } else {
      console.log('❌ Failed to set up test data');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    process.exit(1);
  }
}

setupTestData();
