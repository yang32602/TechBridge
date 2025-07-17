import React from "react";

const Contacto = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Contacto</h1>
      <p>¿Tienes preguntas o deseas comunicarte con nosotros? Rellena el formulario o escríbenos a nuestro correo.</p>

      <form style={{ marginTop: "2rem", maxWidth: "500px" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="nombre">Nombre:</label><br />
          <input type="text" id="nombre" name="nombre" style={{ width: "100%", padding: "0.5rem" }} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Correo electrónico:</label><br />
          <input type="email" id="email" name="email" style={{ width: "100%", padding: "0.5rem" }} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="mensaje">Mensaje:</label><br />
          <textarea id="mensaje" name="mensaje" rows="4" style={{ width: "100%", padding: "0.5rem" }}></textarea>
        </div>

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Contacto;
