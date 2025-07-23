import React from "react";

const Terminos = () => {
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
        Términos de Servicio
      </h1>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Estos Términos de Servicio regulan el uso de la plataforma TechBridge. Al acceder o utilizar
        nuestros servicios, aceptas estos términos en su totalidad. Si no estás de acuerdo con alguno
        de estos términos, te pedimos que no utilices nuestros servicios.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>1. Uso Aceptable</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Los usuarios deben utilizar TechBridge únicamente con fines legales y de acuerdo con todas las
        leyes y regulaciones aplicables. Está prohibido el uso de la plataforma para enviar, cargar o
        distribuir contenido ilegal, difamatorio, ofensivo o que infrinja los derechos de terceros.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>2. Registro de Usuario</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Para acceder a ciertas funcionalidades, es necesario registrarse proporcionando información
        veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de
        su cuenta y contraseña.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>3. Propiedad Intelectual</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Todo el contenido disponible en TechBridge, incluyendo textos, gráficos, logos y software, es
        propiedad de TechBridge o de sus licenciantes y está protegido por las leyes de propiedad
        intelectual. No está permitido copiar, reproducir o distribuir dicho contenido sin autorización.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>4. Terminación</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Nos reservamos el derecho de suspender o cancelar el acceso a la plataforma si se detecta un
        incumplimiento de estos términos, sin necesidad de previo aviso.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>5. Modificaciones</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        TechBridge se reserva el derecho de modificar estos Términos de Servicio en cualquier momento.
        Las modificaciones entrarán en vigor al ser publicadas en el sitio. Se recomienda revisar
        periódicamente esta página para estar al tanto de los cambios.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>6. Contacto</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Si tienes alguna pregunta sobre estos Términos de Servicio, puedes comunicarte con nosotros
        a través del formulario de contacto disponible en la sección "Contacto" del sitio.
      </p>
    </div>
  );
};

export default Terminos;