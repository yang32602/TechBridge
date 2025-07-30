# TechBridge Frontend UI/UX - Documentación Completa

Esta documentación detalla todas las características de diseño, animaciones y efectos especiales del frontend de TechBridge.

## Tabla de Contenido

1. [Arquitectura General](#arquitectura-general)
2. [Páginas Principales](#páginas-principales)
3. [Efectos Especiales](#efectos-especiales)
4. [Animaciones](#animaciones)
5. [Sistema de Diseño](#sistema-de-diseño)
6. [Componentes Reutilizables](#componentes-reutilizables)
7. [Responsive Design](#responsive-design)

---

## Arquitectura General

### Stack Tecnológico
- **React 19**: Framework principal
- **React Router**: Navegación
- **CSS Modules**: Estilos componentizados
- **React Icons**: Iconografía
- **Vite**: Build tool

### Estructura de Archivos
```
src/
├── assets/           # CSS específicos por página
├── components/       # Componentes reutilizables
├── context/         # Context API para estado global
├── pages/           # Páginas principales
├── services/        # API services
└── hooks/           # Custom hooks
```

---

## Páginas Principales

### 1. Página de Inicio (Home)

#### Diseño y Layout
- **Hero Section**: Imagen de fondo con overlay oscuro y texto centrado
- **Typography**: 
  - Título principal: `Epilogue`, 48px, font-weight 700
  - Subtítulo: `Epilogue`, 36px, font-weight 700
- **Colores**: Fondo con gradiente negro transparente sobre imagen

#### Animaciones
- **Hover Effects**: Los botones tienen transformaciones `translateY(-2px)`
- **Logo Hover**: Escala `scale(1.05)` en el logo del header

```css
.hero-title {
  font-family: "Epilogue", sans-serif;
  font-weight: 700;
  animation: fadeInUp 1s ease-out;
}

.btn-primary:hover {
  background: var(--dark-blue);
  transform: translateY(-2px);
}
```

### 2. Autenticación (Login/Register)

#### Layout Dual
- **Sidebar Izquierdo** (634px): Color `#f8f8fd` con estadísticas animadas
- **Formulario Derecho**: Fondo blanco con formularios centrados

#### Efectos Especiales
- **Tabs Animados**: Cambio de color y fondo en pestañas activas
- **Chart Bars**: Barras animadas con diferentes alturas
- **Focus States**: Campos de entrada con border-color `#0a5cb8` y shadow

```css
.chart-bar {
  width: 8px;
  height: 30px;
  background: rgba(10, 92, 184, 0.2);
  border-radius: 40px;
  transition: height 0.3s ease;
}

.form-group input:focus {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 2px rgba(10, 92, 184, 0.1);
}
```

### 3. Dashboard Estudiante

#### Layout Principal
- **Sidebar Fijo** (272px): Navegación con menú azul `#ebf4ff`
- **Contenido Principal**: Grid de estadísticas y gráficos

#### Estadísticas Animadas
- **Cards de Stats**: 4 columnas con iconos y números grandes
- **Skill Bars**: Barras de progreso animadas con diferentes colores
- **Project Items**: Cards con iconos y hover effects

```css
.student-skill-progress {
  height: 100%;
  background: #0a5cb8;
  border-radius: 25px;
  transition: width 0.3s ease;
}

.student-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
```

### 4. Dashboard Empresa

#### Header Empresa
- **Logo Grande** (189px): Placeholder SVG con botón de edición sobrepuesto
- **Información de Empresa**: Título grande con metadatos
- **Stats Cards**: 3 cards horizontales con colores distintivos (azul, verde, naranja)

#### Gráficos y Visualización
- **Chart Area**: Placeholder para gráficos con tooltip simulado
- **Candidates Cards**: Lista de candidatos con avatars circulares

```css
.company-stat-card {
  padding: 24px;
  border-radius: 8px;
  color: white;
  transition: transform 0.2s ease;
}

.company-stat-card:hover {
  transform: scale(1.02);
}
```

### 5. Vacantes - Efectos Especiales Destacados

#### Grid Layout
- **Responsive Grid**: `grid-template-columns: repeat(auto-fill, minmax(400px, 1fr))`
- **Card Hover**: Elevación con shadow y translate

#### Efectos de Hover
```css
.vacante-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.view-details {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.vacante-card:hover .view-details {
  opacity: 1;
}
```

#### Modal de Creación
- **Overlay**: Fondo semi-transparente `rgba(0, 0, 0, 0.5)`
- **Modal Centrado**: Animación de aparición suave
- **Form Validation**: Estados visuales para errores

### 6. Postulantes - Sistema de Desbloqueo

#### **Efecto de Nebulización (Blur Effect)**
El efecto más destacado de la aplicación:

```css
.blurred {
  filter: blur(8px);
  opacity: 0.6;
}

.blurred-text {
  filter: blur(4px);
  user-select: none;
  pointer-events: none;
}
```

#### **Lock Overlay System**
- **Overlay Circular**: Posicionamiento absoluto sobre imágenes
- **Lock Icon**: Centrado con fondo semi-transparente

```css
.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
```

#### **Botón de Desbloqueo Animado**
```css
.unlock-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.unlock-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.unlock-btn:hover::before {
  left: 100%;
}
```

#### **Animación de Desbloqueo Exitoso**
```css
.unlock-animation {
  animation: unlockSuccess 0.6s ease-out;
}

@keyframes unlockSuccess {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### 7. Balance Display con Animación Sparkle

#### TechPoints Display
```css
.balance-display {
  background: rgba(10, 92, 184, 0.08);
  border: 2px solid #0a5cb8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(10, 92, 184, 0.15);
}

.balance-icon {
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(180deg);
  }
}
```

---

## Efectos Especiales Detallados

### 1. Sistema de Desbloqueo en Postulantes

#### **Componente de Estado**
- **Estados**: `locked`, `unlocked`, `unlock-animation`
- **Transiciones**: Basadas en `desbloqueado` field del backend

#### **Flujo de Interacción**
1. **Estado Inicial**: Imagen borrosa + overlay de candado
2. **Hover en Botón**: Efecto de brillo deslizante
3. **Click**: Estado de carga "Desbloqueando..."
4. **Éxito**: Animación de escala + remoción de blur
5. **Estado Final**: Botón "Ver perfil" habilitado

### 2. Wiggle Animation en Unlock Icon

```css
.unlock-icon {
  animation: wiggle 1s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
```

### 3. Gradient Backgrounds

#### Cards de Estadísticas Empresa
```css
.company-stat-card.blue {
  background: #0a5cb8;
}

.company-stat-card.green {
  background: #56cdad;
}

.company-stat-card.orange {
  background: #f4a261;
}
```

---

## Animaciones por Categoría

### 1. Hover Animations
- **Cards**: `transform: translateY(-2px)` + shadow
- **Buttons**: Color change + scale
- **Icons**: Rotate + scale

### 2. Loading States
- **Spinners**: CSS animations con `@keyframes`
- **Skeleton**: Shimmer effects
- **Progress Bars**: Width transitions

### 3. Transitions
- **Page Navigation**: Fade effects
- **Modal Appearance**: Scale + opacity
- **Form States**: Border color + shadow

### 4. Micro-interactions
- **Button Clicks**: `translateY(0)` on `:active`
- **Icon Highlights**: Color transitions
- **Card Selections**: Border + background change

---

## Sistema de Diseño

### Colores Principales
```css
:root {
  --primary-blue: #0a5cb8;
  --dark-blue: #094180;
  --white: #fff;
  --black: #202430;
  --dark-gray: #25324b;
  --medium-gray: #515b6f;
  --light-gray: #a8adb7;
  --border-gray: #d6ddeb;
  --background-light: #f8f8fd;
}
```

### Typography Scale
- **Headers**: `League Spartan`, weights 600-700
- **Body**: `Inter`, weights 400-600
- **Forms**: `Epilogue`, weights 400-700

### Spacing System
- **Base Unit**: 8px
- **Component Padding**: 16px, 24px, 32px
- **Grid Gaps**: 16px, 24px, 32px

### Border Radius
- **Small**: 4px (inputs, buttons)
- **Medium**: 8px (cards)
- **Large**: 12px (containers)
- **Round**: 50% (avatars)

---

## Componentes Reutilizables

### 1. Avatar System
```css
.applicant-image-default {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ffffff;
  /* Color generado dinámicamente por JavaScript */
}
```

### 2. Badge System
```css
.skill-badge {
  background: #0a5cb8;
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
```

### 3. Button Variants
- **Primary**: Azul sólido
- **Secondary**: Outline azul
- **Unlock**: Gradiente naranja
- **Danger**: Rojo para eliminación

### 4. Input States
- **Default**: Border gris claro
- **Focus**: Border azul + shadow
- **Error**: Border rojo + mensaje
- **Disabled**: Opacity reducida

---

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { /* ... */ }

/* Tablet */
@media (max-width: 768px) { /* ... */ }

/* Desktop */
@media (max-width: 1200px) { /* ... */ }
```

### Adaptive Layouts
1. **Grid Collapse**: De multi-columna a single column
2. **Sidebar Hiding**: Sidebar fijo se oculta en móvil
3. **Typography Scale**: Reducción de font-sizes
4. **Touch Targets**: Aumento de padding para móvil

---

## Optimizaciones de Performance

### 1. CSS Loading
- **Critical CSS**: Estilos inline para above-the-fold
- **Lazy Loading**: CSS no crítico cargado posteriormente

### 2. Animation Performance
- **GPU Acceleration**: `transform` y `opacity` preferidos
- **Will-change**: Property para animaciones complejas
- **Reduced Motion**: Respeto por `prefers-reduced-motion`

### 3. Asset Optimization
- **Image Compression**: WebP cuando sea posible
- **CSS Minification**: En producción
- **Unused CSS**: Eliminación automática

---

## Casos de Uso Específicos

### 1. Sistema de Notificaciones
- **Toast Messages**: Aparición desde esquina superior
- **Badges**: Números rojos en iconos de campana
- **Status Indicators**: Puntos de color para estados

### 2. Data Visualization
- **Progress Bars**: Skill levels de estudiantes
- **Charts**: Placeholders para futuros gráficos
- **Statistics Cards**: Números grandes con iconos

### 3. Form Validation
- **Real-time**: Validación durante tipeo
- **Visual Feedback**: Colores y iconos de estado
- **Error Messages**: Texto explicativo claro

---

## Mantenimiento y Extensibilidad

### 1. CSS Architecture
- **BEM Naming**: Para claridad y mantenimiento
- **Component Isolation**: Estilos específicos por archivo
- **Utility Classes**: Para espaciado y posicionamiento

### 2. Design Tokens
- **Color Variables**: Definidas en `:root`
- **Typography Scale**: Consistente entre componentes
- **Spacing Units**: Sistema basado en múltiplos de 8px

### 3. Future Enhancements
- **Dark Mode**: Variables CSS preparadas
- **Animations Library**: Framer Motion considerado
- **Design System**: Storybook para documentación

---

## Conclusión

El frontend de TechBridge implementa un sistema de diseño robusto con énfasis en micro-interacciones y feedback visual. Los efectos especiales como el sistema de desbloqueo en Postulantes y las animaciones de sparkle crean una experiencia de usuario memorable y profesional.

La arquitectura modular permite fácil mantenimiento y extensión, mientras que el sistema responsive asegura una experiencia consistente en todos los dispositivos.

**Tecnologías clave utilizadas:**
- CSS3 Advanced (Flexbox, Grid, Animations)
- React 19 (Hooks, Context API)
- Modern JavaScript (ES6+)
- Responsive Design Principles
- Performance Best Practices
