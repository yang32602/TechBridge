import React from "react";

const Contacto = () => {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "80px auto",
      padding: "2rem",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      color: "#333"
    }}>
      <h1 style={{
        fontSize: "2rem",
        borderBottom: "2px solid #eaeaea",
        paddingBottom: "0.5rem",
        marginBottom: "1rem"
      }}>
        Contacto
      </h1>

      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        ¿Tienes preguntas o deseas comunicarte con nosotros? Rellena el formulario o escríbenos a nuestro correo.
      </p>

      <form style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="nombre" style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="email" style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Correo electrónico:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="mensaje" style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Mensaje:
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Contacto;