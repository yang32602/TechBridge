import React from "react";

const Cookies = () => {
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
        Política de Cookies
      </h1>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Esta Política de Cookies explica qué son las cookies y cómo las utilizamos en TechBridge. Al utilizar
        nuestro sitio web, aceptas el uso de cookies de acuerdo con esta política.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>1. ¿Qué son las Cookies?</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
        Estas permiten que el sitio recuerde tus acciones y preferencias durante un periodo de tiempo.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>2. Cómo usamos las Cookies</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio, ofrecer funciones
        de redes sociales y personalizar el contenido y los anuncios.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>3. Tipos de Cookies que Utilizamos</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        - Cookies esenciales: necesarias para el funcionamiento básico del sitio.<br />
        - Cookies de rendimiento: nos ayudan a entender cómo los usuarios interactúan con el sitio.<br />
        - Cookies de funcionalidad: permiten recordar tus preferencias.<br />
        - Cookies de publicidad: se utilizan para mostrar anuncios relevantes.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>4. Gestión de Cookies</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Puedes gestionar o eliminar cookies desde la configuración de tu navegador. Ten en cuenta que desactivar cookies
        puede afectar la funcionalidad de ciertas partes del sitio web.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>5. Cambios en esta Política</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Podemos modificar esta Política de Cookies en cualquier momento. Cualquier cambio será publicado en esta página
        y, si es necesario, te notificaremos mediante los canales apropiados.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>6. Contacto</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Si tienes preguntas o inquietudes sobre nuestra política de cookies, contáctanos mediante el formulario de contacto
        disponible en la sección "Contacto" del sitio.
      </p>
    </div>
  );
};

export default Cookies;
