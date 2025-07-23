import React from "react";

const Privacidad = () => {
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
        Política de Privacidad
      </h1>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        En TechBridge, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta
        Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos la
        información que obtenemos de los usuarios de nuestra plataforma.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>1. Información Recopilada</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Podemos recopilar información personal como nombre, correo electrónico, teléfono, dirección IP,
        y datos de navegación cuando utilizas nuestros servicios o te registras en nuestra plataforma.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>2. Uso de la Información</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Utilizamos tu información para ofrecer y mejorar nuestros servicios, personalizar tu experiencia,
        procesar solicitudes y comunicarnos contigo con fines administrativos o promocionales.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>3. Compartir Información</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        No compartimos tu información personal con terceros, salvo cuando sea necesario para prestar un
        servicio solicitado, cumplir con la ley, proteger nuestros derechos, o con tu consentimiento.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>4. Seguridad</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Implementamos medidas de seguridad adecuadas para proteger tu información contra accesos no
        autorizados, alteraciones, divulgación o destrucción.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>5. Tus Derechos</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Tienes derecho a acceder, corregir o eliminar tu información personal. También puedes oponerte
        al tratamiento de tus datos o retirar tu consentimiento en cualquier momento.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>6. Cambios en esta Política</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios
        importantes y te recomendamos revisar periódicamente esta página.
      </p>

      <h2 style={{ fontSize: "1.25rem", marginTop: "2rem", marginBottom: "0.5rem" }}>7. Contacto</h2>
      <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
        Si tienes preguntas o inquietudes sobre esta política, puedes contactarnos a través del formulario
        disponible en la sección "Contacto" de nuestro sitio web.
      </p>
    </div>
  );
};

export default Privacidad;
