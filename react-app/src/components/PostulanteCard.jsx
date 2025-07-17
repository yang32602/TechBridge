import React from "react";
import "../assets/styles.css"; // Asegúrate que tenga estilos globales

const PostulanteCard = ({ nombre, carrera, universidad, imagen }) => {
  return (
    <div className="postulante-card">
      <img src={imagen} alt={nombre} className="postulante-img" />

      <div className="postulante-info">
        <h3>{nombre}</h3>
        <p><strong>Carrera:</strong> {carrera}</p>
        <p><strong>Universidad:</strong> {universidad}</p>
        <button className="btn btn-primary">Ver Perfil</button>
      </div>
    </div>
  );
};

export default PostulanteCard;
