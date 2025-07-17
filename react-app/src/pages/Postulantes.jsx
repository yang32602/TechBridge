import React from "react";
import PostulanteCard from "../components/PostulanteCard"; 


const Postulantes = () => {
  const postulantes = [
    {
      id: 1,
      nombre: "Ana González",
      carrera: "Ingeniería en Sistemas",
      universidad: "Universidad Tecnológica de Panamá",
    },
    {
      id: 2,
      nombre: "Carlos Pérez",
      carrera: "Lic. en Redes y Seguridad Informática",
      universidad: "Universidad de Panamá",
    },
    {
      id: 3,
      nombre: "María López",
      carrera: "Ingeniería Electrónica",
      universidad: "Universidad Latina de Panamá",
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Listado de Postulantes</h1>
      <div>
        {postulantes.map((postulante) => (
          <div
            key={postulante.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <h3>{postulante.nombre}</h3>
            <p><strong>Carrera:</strong> {postulante.carrera}</p>
            <p><strong>Universidad:</strong> {postulante.universidad}</p>
            <button
              onClick={() => alert(`Ver perfil de ${postulante.nombre}`)}
              style={{ padding: "0.5rem", marginTop: "0.5rem" }}
            >
              Ver perfil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Postulantes;
