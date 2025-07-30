import React from "react";
import { Link } from "react-router-dom";
// React Icons
import {
  HiCheckCircle,
  HiSearch,
  HiEye,
  HiOfficeBuilding,
  HiArrowRight,
  HiTrendingUp,
  HiWifi,
  HiFolder,
  HiStar,
  HiChat,
  HiLocationMarker,
} from "react-icons/hi";

const Home = () => {
  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="main-title">Somos TechBridge</span>
            <span className="subtitle">
              Hay mas de <span className="number">50,493</span> de postulantes
              inscritos y más de <span className="number">3,000</span> Vacantes
              esperandote
            </span>
          </h1>
        </div>
      </section>

      {/* Companies Section */}
      <section className="companies">
        <div className="container">
          <h2 className="companies-title">Compañias inscritas</h2>
          <div className="companies-grid">
            <img
              src="https://th.bing.com/th/id/R.99e33c3a00ab7593ee86e6cbfe524eaf?rik=pYW0Kgbx4bdGPA&riu=http%3a%2f%2ferp.rootstack.com%2ffiles%2frootstack_logo_navbar.png&ehk=PggB1XhqbJPPpVqDn6W%2bzEYTBKKH58gAF0xdclCNi1U%3d&risl=&pid=ImgRaw&r=0"
              alt="Rootstack"
              className="company-logo"
            />
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.huoXJUx5GTROL0b4E7RSTAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Banco General"
              className="company-logo"
            />
            <img
              src="https://awsmp-logos.s3.amazonaws.com/seller-y2kys3322z7fk/fcf89f41aa4b28e120d0a8759d2560a7.png"
              alt="Karakuri"
              className="company-logo"
            />
            <img
              src="https://www.quarco.fr/wp-content/uploads/2023/04/QUARCO_rvb_HD.jpg"
              alt="Quarco"
              className="company-logo"
            />
            <img
              src="https://vectorseek.com/wp-content/uploads/2023/11/BairesDev-Logo-Vector.svg-.png"
              alt="BairesDev"
              className="company-logo"
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps">
        <div className="steps-content">
          <h2 className="steps-title">
            Crea una cuenta y descubre oportunidades que se adapten a ti
          </h2>

          <div className="steps-list">
            <div className="step-item">
              <HiCheckCircle className="step-icon" size={44} color="#25324B" />
              <p className="step-text">
                Ingresa en la opción Crear cuenta, completa tus datos y
                confirmalos.
              </p>
            </div>

            <div className="step-item">
              <HiSearch className="step-icon" size={44} color="#25324B" />
              <p className="step-text">
                Explora oportunidades laborales y descubre nuevos talentos.
              </p>
            </div>

            <div className="step-item">
              <HiEye className="step-icon" size={44} color="#25324B" />
              <p className="step-text">
                Recuerda mantener tu información personal actualizada
              </p>
            </div>

            <div className="step-item">
              <HiOfficeBuilding
                className="step-icon"
                size={44}
                color="#25324B"
              />
              <p className="step-text">
                Aplica a las vacantes que más te interesen y conecta con
                empresas
              </p>
            </div>
          </div>

          <Link to="/register">
            <button className="create-account-btn">Crear cuenta</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <HiTrendingUp size={48} color="#0A5CB8" />
            </div>
            <h3 className="feature-title">pruebas tecnicas en linea</h3>
            <p className="feature-description">
              Resultados automatizados visibles para las empresas
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiWifi size={48} color="#FF8000" />
            </div>
            <h3 className="feature-title">Sistemas de rango</h3>
            <p className="feature-description">
              Niveles de experiencia basados en pruebas tecnicas.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiFolder size={48} color="#2AE620" />
            </div>
            <h3 className="feature-title">Subir Proyectos academicos</h3>
            <p className="feature-description">
              Espacio donde puedes subir tus proyectos y trabajos destacados.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiStar size={48} color="#C726C4" />
            </div>
            <h3 className="feature-title">Badges de verificaión</h3>
            <p className="feature-description">
              Sistema de badges para verificar la capacidad de los candidatos
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiChat size={48} color="#A362FE" />
            </div>
            <h3 className="feature-title">Foros/mentorias</h3>
            <p className="feature-description">
              Espacio de discuciones y comentarios
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <HiLocationMarker size={48} color="#F19EDC" />
            </div>
            <h3 className="feature-title">Asistencia y Formación</h3>
            <p className="feature-description">
              Tutoriales para completar perfil, hacer exámenes, postularse
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-header">
          <h2 className="testimonials-title">Testimonios</h2>
          <a href="#" className="show-more">
            Mostrar mas
            <HiArrowRight size={24} color="#0A5CB8" />
          </a>
        </div>

        <div className="testimonials-grid">
          <div>
            <div className="testimonial-card">
              <div
                className="testimonial-avatar"
                style={{
                  background:
                    "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face) center/cover",
                }}
              ></div>
              <div className="testimonial-content">
                <h4 className="testimonial-name">Hernesto Perez</h4>
                <p className="testimonial-text">
                  "La plataforma es muy intutitiva y me permitió encontrar oportunidades rápidamente. Me gustaría que hubiera más filtros en la busqueda de vacantes"
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div
                className="testimonial-avatar"
                style={{
                  background:
                    "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face) center/cover",
                }}
              ></div>
              <div className="testimonial-content">
                <h4 className="testimonial-name">Francisco Clark</h4>
                <p className="testimonial-text">
                  "Me encanta el diseño limpio y lo fácil que fue registrarme. En general, la experiencia ha sido muy buena."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div
                className="testimonial-avatar"
                style={{
                  background:
                    "url(https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face) center/cover",
                }}
              ></div>
              <div className="testimonial-content">
                <h4 className="testimonial-name">Mike Foreman</h4>
                <p className="testimonial-text">
                  "Encontré mi primera oportunidad laboral en pocos días. Sería genial contar con más opciones para personalizar mi perfil."
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="testimonial-card">
              <div
                className="testimonial-avatar"
                style={{
                  background:
                    "url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face) center/cover",
                }}
              ></div>
              <div className="testimonial-content">
                <h4 className="testimonial-name">Astrid Johnson</h4>
                <p className="testimonial-text">
                  "El sistema funciona bien y el proceso es claro. A veces tarda un poco en cargar, pero nada grave."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div
                className="testimonial-avatar"
                style={{
                  background:
                    "url(https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face) center/cover",
                }}
              ></div>
              <div className="testimonial-content">
                <h4 className="testimonial-name">James Medina</h4>
                <p className="testimonial-text">
                  "Me ayudó a conectar con varias empresas en poco tiempo. Agregar un chat directo con reclutadores sería un plus."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div
                className="testimonial-avatar"
                style={{
                  background:
                    "url(https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face) center/cover",
                }}
              ></div>
              <div className="testimonial-content">
                <h4 className="testimonial-name">Hugo Rovira</h4>
                <p className="testimonial-text">
                  "El sistema de registro fue sencillo y rápido. Me gustaría que agregaran más espacios para mostrar mis proyectos."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
