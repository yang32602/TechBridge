-- Insert a test user first (if not exists)
INSERT IGNORE INTO usuarios (id, correo, contrasena, nombre_completo, tipo_usuario) 
VALUES (1, 'test@empresa.com', '$2b$10$test.hash.password', 'Test User', 'empresas');

-- Insert a test empresa with id = 1
INSERT IGNORE INTO empresas (id, nombre, ruc, sector, descripcion, telefono, id_usuario) 
VALUES (1, 'TechCorp S.A.', '20123456789', 'Tecnología', 'Una empresa de tecnología innovadora', '+51 999 888 777', 1);

-- Insert a test vacante that references the empresa
INSERT IGNORE INTO vacantes (id, id_empresa, titulo, descripcion, responsabilidades, requisitos, beneficios, ubicacion, fecha_publicacion) 
VALUES (1, 1, 'Desarrollador Frontend', 'Buscamos desarrollador frontend', 'Desarrollar interfaces', 'React, JavaScript', 'Beneficios corporativos', 'Lima, Peru', '2024-01-15');

-- Verify the data
SELECT 'USUARIOS:' as table_name, u.* FROM usuarios u WHERE u.id = 1
UNION ALL
SELECT 'EMPRESAS:', e.* FROM empresas e WHERE e.id = 1  
UNION ALL
SELECT 'VACANTES:', v.* FROM vacantes v WHERE v.id = 1;
