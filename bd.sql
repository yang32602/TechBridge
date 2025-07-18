DROP DATABASE IF EXISTS techBridge_db;
CREATE DATABASE techBridge_db;
USE techBridge_db;


CREATE TABLE usuarios(
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('estudiante', 'empresa', 'admin') NOT NULL,
  correo VARCHAR(100) CHECK (correo LIKE '%@%') NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  biografia TEXT,
  foto_perfil VARCHAR(150),
  validado TINYINT(1) DEFAULT 0
);

CREATE TABLE membresias(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) UNIQUE NOT NULL,
precio DECIMAL(10,2) NOT NULL,
beneficios VARCHAR(1000)
);

CREATE TABLE tecnologias(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100)
);

CREATE TABLE areas(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100)
);

CREATE TABLE insignias(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL, 
descripcion VARCHAR(1000) NOT NULL,
id_tecnologia INT,
CONSTRAINT fk_insgnia_tecnologia FOREIGN KEY (id_tecnologia) REFERENCES tecnologias(id)
);

CREATE TABLE estudiantes(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre_completo VARCHAR(50) NOT NULL,
fecha_nacimiento DATE,
cedula VARCHAR(20),
id_usuario INT,
sobremi VARCHAR(2000),
github VARCHAR(200),
lenguajes VARCHAR(2000),
pais VARCHAR(100),
contratado BOOLEAN DEFAULT FALSE,
expoPushToken VARCHAR(255), 
CONSTRAINT fk_estudiante_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE empresas(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
ruc VARCHAR(50) NOT NULL,
sector VARCHAR(100),
logo_url VARCHAR(150),
descripcion VARCHAR(1000),
telefono VARCHAR(30),
id_usuario INT,
expoPushToken VARCHAR(255),
CONSTRAINT fk_empresa_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE prueba(
id INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT,
id_insignia INT NOT NULL,
puntaje DECIMAL (5,2) NOT NULL,
fecha_realizacion DATE,
duracion INT,
CONSTRAINT fk_prueba_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
CONSTRAINT fk_prueba_insignia FOREIGN KEY (id_insignia) REFERENCES insignias(id)
);

CREATE TABLE documentos(
id INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT,
url_archivo VARCHAR(255),
fecha_subida DATE,
CONSTRAINT fk_documentos_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE pagos(
id INT AUTO_INCREMENT PRIMARY KEY,
id_membresia INT NOT NULL ,
monto DECIMAL(6,2) NOT null,
fecha_pago DATE NOT NULL,
estado ENUM('pendiente', 'aprobado', 'rechazado', 'reembolsado', 'cancelado') NOT NULL DEFAULT 'pendiente',
metodo ENUM('yappy','transaccion', 'paypal')  NOT NULL DEFAULT 'paypal',
CONSTRAINT fk_pago_membresia FOREIGN KEY (id_membresia) REFERENCES membresias(id)
);

CREATE TABLE vacantes(
id INT AUTO_INCREMENT PRIMARY KEY,
id_empresa INT NOT NULL,
titulo VARCHAR(100) NOT NULL,
descripcion VARCHAR(10000) NOT NULL,
ubicacion VARCHAR(1000) NOT NULL,
fecha_publicacion DATE,
CONSTRAINT fk_vacante_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id)
);

CREATE TABLE postulacion(
id INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
id_vacante INT NOT NULL,
fecha_postulacion DATE,
estado BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_postulacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
CONSTRAINT fk_postulacion_vacante FOREIGN KEY (id_vacante) REFERENCES vacantes(id)
);

CREATE TABLE prueba_tecnologia(
id_prueba INT,
id_tecnologia INT,
PRIMARY KEY (id_prueba,id_tecnologia),
CONSTRAINT fk_pt_prueba FOREIGN KEY (id_prueba) REFERENCES prueba(id),
CONSTRAINT fk_pt_tecnologia FOREIGN KEY (id_tecnologia) REFERENCES tecnologias(id)
);

CREATE TABLE usuario_insignia (
  id_usuario INT,
  id_insignia INT,
  fecha_asignacion DATE,
  PRIMARY KEY (id_usuario, id_insignia),
  CONSTRAINT fk_ui_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  CONSTRAINT fk_ui_insignia FOREIGN KEY (id_insignia) REFERENCES insignias(id)
);

CREATE TABLE usuario_membresia_pago (
  id_usuario INT,
  id_membresia INT,
  id_pago INT,
  fecha_asignacion DATE,
  fecha_final DATE,
  PRIMARY KEY (id_usuario, id_membresia, id_pago),
  CONSTRAINT fk_ump_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  CONSTRAINT fk_ump_membresia FOREIGN KEY (id_membresia) REFERENCES membresias(id),
  CONSTRAINT fk_ump_pago FOREIGN KEY (id_pago) REFERENCES pagos(id)
);

CREATE TABLE empresa_estudiante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_estudiante INT NOT NULL,
    fecha_reclutamiento DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    FOREIGN KEY (id_empresa) REFERENCES empresas(id),
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

CREATE TABLE experiencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT NOT NULL,
  tipo ENUM('laboral', 'academica') NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  empresa_o_institucion VARCHAR(150) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  CONSTRAINT fk_experiencias_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);




