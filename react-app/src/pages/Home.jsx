import React from "react";

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
              <svg
                className="step-icon"
                width="44"
                height="47"
                viewBox="0 0 44 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.9993 7.71517C13.8992 7.71517 7.33268 14.5801 7.33268 23.0485C7.33268 31.5169 13.8992 38.3818 21.9993 38.3818C30.0995 38.3818 36.666 31.5169 36.666 23.0485C36.666 14.5801 30.0995 7.71517 21.9993 7.71517ZM3.66602 23.0485C3.66602 12.463 11.8741 3.88184 21.9993 3.88184C32.1246 3.88184 40.3327 12.463 40.3327 23.0485C40.3327 33.634 32.1246 42.2152 21.9993 42.2152C11.8741 42.2152 3.66602 33.634 3.66602 23.0485Z"
                  fill="#25324B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28.7957 17.8602C29.5117 18.6087 29.5117 19.8223 28.7957 20.5708L21.4624 28.2374C20.7464 28.986 19.5856 28.986 18.8697 28.2374L15.203 24.4041C14.487 23.6556 14.487 22.442 15.203 21.6935C15.9189 20.945 17.0798 20.945 17.7957 21.6935L20.166 24.1716L26.203 17.8602C26.9189 17.1117 28.0798 17.1117 28.7957 17.8602Z"
                  fill="#25324B"
                />
              </svg>
              <p className="step-text">
                Ingresa en la opción Crear cuenta, completa tus datos y
                confirmalos.
              </p>
            </div>

            <div className="step-item">
              <svg
                className="step-icon"
                width="44"
                height="43"
                viewBox="0 0 44 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="21.5708"
                  cy="20.6411"
                  rx="16.479"
                  ry="15.73"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M33.0332 32.3984L39.4939 38.5495"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="step-text">
                Explora oportunidades laborales y descubre nuevos talentos.
              </p>
            </div>

            <div className="step-item">
              <svg
                className="step-icon"
                width="44"
                height="45"
                viewBox="0 0 44 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40.1865 21.3152C36.4832 12.7168 29.5165 7.38184 21.9999 7.38184C14.4832 7.38184 7.51654 12.7168 3.81321 21.3152C3.71226 21.5465 3.66016 21.7961 3.66016 22.0485C3.66016 22.3009 3.71226 22.5505 3.81321 22.7818C7.51654 31.3802 14.4832 36.7152 21.9999 36.7152C29.5165 36.7152 36.4832 31.3802 40.1865 22.7818C40.2875 22.5505 40.3396 22.3009 40.3396 22.0485C40.3396 21.7961 40.2875 21.5465 40.1865 21.3152ZM21.9999 33.0485C16.1699 33.0485 10.6882 28.8502 7.51654 22.0485C10.6882 15.2468 16.1699 11.0485 21.9999 11.0485C27.8299 11.0485 33.3115 15.2468 36.4832 22.0485C33.3115 28.8502 27.8299 33.0485 21.9999 33.0485ZM21.9999 14.7152C20.5495 14.7152 19.1317 15.1453 17.9257 15.9511C16.7197 16.7569 15.7798 17.9022 15.2248 19.2422C14.6697 20.5821 14.5245 22.0566 14.8075 23.4792C15.0904 24.9017 15.7888 26.2084 16.8144 27.234C17.84 28.2595 19.1467 28.958 20.5692 29.2409C21.9917 29.5239 23.4662 29.3787 24.8062 28.8236C26.1462 28.2686 27.2915 27.3286 28.0973 26.1227C28.9031 24.9167 29.3332 23.4989 29.3332 22.0485C29.3332 20.1036 28.5606 18.2383 27.1853 16.8631C25.8101 15.4878 23.9448 14.7152 21.9999 14.7152Z"
                  fill="#25324B"
                />
              </svg>
              <p className="step-text">
                Recuerda mantener tu información personal actualizada
              </p>
            </div>

            <div className="step-item">
              <svg
                className="step-icon"
                width="44"
                height="47"
                viewBox="0 0 44 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 40.2988H38.5"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.16602 40.2988V13.4655L23.8327 5.79883V40.2988"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M34.834 40.2992V21.1325L23.834 13.4658"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 17.2988V17.318"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 23.0488V23.068"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 28.7988V28.818"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 34.5488V34.568"
                  stroke="#25324B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="step-text">
                Aplica a las vacantes que más te interesen y conecta con
                empresas
              </p>
            </div>
          </div>

          <button className="create-account-btn">Crear cuenta</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="46"
                height="44"
                viewBox="0 0 46 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M42.1673 22H34.5007L28.7507 38.5L17.2507 5.5L11.5007 22H3.83398"
                  stroke="#0A5CB8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="feature-title">pruebas tecnicas en linea</h3>
            <p className="feature-description">
              Resultados automatizados visibles para las empresas
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.4796 15.5204C33.5954 16.6348 34.4805 17.9583 35.0844 19.4151C35.6882 20.8718 35.9991 22.4334 35.9991 24.0104C35.9991 25.5873 35.6882 27.1489 35.0844 28.6056C34.4805 30.0624 33.5954 31.3859 32.4796 32.5004M15.5196 32.4804C14.4039 31.3659 13.5188 30.0424 12.9149 28.5856C12.311 27.1289 12.0002 25.5673 12.0002 23.9904C12.0002 22.4134 12.311 20.8518 12.9149 19.3951C13.5188 17.9383 14.4039 16.6148 15.5196 15.5004M38.1396 9.86035C41.8891 13.6109 43.9954 18.6971 43.9954 24.0004C43.9954 29.3036 41.8891 34.3898 38.1396 38.1404M9.85963 38.1404C6.11021 34.3898 4.00391 29.3036 4.00391 24.0004C4.00391 18.6971 6.11021 13.6109 9.85963 9.86035M27.9996 24.0004C27.9996 26.2095 26.2088 28.0004 23.9996 28.0004C21.7905 28.0004 19.9996 26.2095 19.9996 24.0004C19.9996 21.7912 21.7905 20.0004 23.9996 20.0004C26.2088 20.0004 27.9996 21.7912 27.9996 24.0004Z"
                  stroke="#FF8000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="feature-title">Sistemas de rango</h3>
            <p className="feature-description">
              Niveles de experiencia basados en pruebas tecnicas.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 38C44 39.0609 43.5786 40.0783 42.8284 40.8284C42.0783 41.5786 41.0609 42 40 42H8C6.93913 42 5.92172 41.5786 5.17157 40.8284C4.42143 40.0783 4 39.0609 4 38V10C4 8.93913 4.42143 7.92172 5.17157 7.17157C5.92172 6.42143 6.93913 6 8 6H18L22 12H40C41.0609 12 42.0783 12.4214 42.8284 13.1716C43.5786 13.9217 44 14.9391 44 16V38Z"
                  stroke="#2AE620"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="feature-title">Subir Proyectos academicos</h3>
            <p className="feature-description">
              Espacio donde puedes subir tus proyectos y trabajos destacados.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.42 27.78L14 46L24 40L34 46L31.58 27.76M38 16C38 23.732 31.732 30 24 30C16.268 30 10 23.732 10 16C10 8.26801 16.268 2 24 2C31.732 2 38 8.26801 38 16Z"
                  stroke="#C726C4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="feature-title">Badges de verificaión</h3>
            <p className="feature-description">
              Sistema de badges para verificar la capacidad de los candidatos
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M42 23.0001C42.0069 25.6398 41.3901 28.2438 40.2 30.6001C38.7889 33.4235 36.6195 35.7984 33.9349 37.4586C31.2503 39.1188 28.1565 39.9988 25 40.0001C22.3603 40.0069 19.7562 39.3902 17.4 38.2001L6 42.0001L9.8 30.6001C8.60986 28.2438 7.99312 25.6398 8 23.0001C8.00122 19.8436 8.88122 16.7498 10.5414 14.0652C12.2017 11.3806 14.5765 9.21119 17.4 7.80006C19.7562 6.60992 22.3603 5.99317 25 6.00006H26C30.1687 6.23004 34.1061 7.98958 37.0583 10.9418C40.0105 13.894 41.77 17.8314 42 22.0001V23.0001Z"
                  stroke="#A362FE"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="feature-title">Foros/mentorias</h3>
            <p className="feature-description">
              Espacio de discuciones y comentarios
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                  stroke="#F19EDC"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M32.48 15.52L28.24 28.24L15.52 32.48L19.76 19.76L32.48 15.52Z"
                  stroke="#F19EDC"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.75 11.7256L4.75 11.7256"
                stroke="#0A5CB8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.7012 5.701L19.7512 11.725L13.7012 17.75"
                stroke="#0A5CB8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
                <h4 className="testimonial-name">Pepe Ganga</h4>
                <p className="testimonial-text">
                  "me pareció una plataforma súper útil. Me ayudó a mostrar mis
                  habilidades reales con pruebas técnicas"
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
                <h4 className="testimonial-name">Pepe Ganga</h4>
                <p className="testimonial-text">
                  "me pareció una plataforma súper útil. Me ayudó a mostrar mis
                  habilidades reales con pruebas técnicas"
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
                <h4 className="testimonial-name">Pepe Ganga</h4>
                <p className="testimonial-text">
                  "me pareció una plataforma súper útil. Me ayudó a mostrar mis
                  habilidades reales con pruebas técnicas"
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
                <h4 className="testimonial-name">Pepe Ganga</h4>
                <p className="testimonial-text">
                  "me pareció una plataforma súper útil. Me ayudó a mostrar mis
                  habilidades reales con pruebas técnicas"
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
                <h4 className="testimonial-name">Pepe Ganga</h4>
                <p className="testimonial-text">
                  "me pareció una plataforma súper útil. Me ayudó a mostrar mis
                  habilidades reales con pruebas técnicas"
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
                <h4 className="testimonial-name">Pepe Ganga</h4>
                <p className="testimonial-text">
                  "me pareció una plataforma súper útil. Me ayudó a mostrar mis
                  habilidades reales con pruebas técnicas"
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
