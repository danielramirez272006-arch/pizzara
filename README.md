# 🎨 PizarraMastery - Plataforma Educativa de Pizarras Interactivas y Seguridad en Rutas

Una aplicación web interactiva desarrollada con **React 19**, **Vite** y **React Router DOM v7**, enfocada en la enseñanza y práctica de técnicas pedagógicas con pizarras (acrílicas, tizas tradicionales y digitales), junto con un sistema robusto de **autenticación, persistencia y protección de rutas privadas basada en roles (RBAC)**.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Arquitectura de Seguridad y Protección de Rutas](#-arquitectura-de-seguridad-y-protección-de-rutas)
3. [Estructura de Roles y Permisos (RBAC)](#-estructura-de-roles-y-permisos-rbac)
4. [Funcionalidades de la Plataforma](#-funcionalidades-de-la-plataforma)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
7. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
8. [Flujo de Navegación y Demostración](#-flujo-de-navegación-y-demostración)

---

## 🌟 Descripción General

**PizarraMastery** es un entorno virtual diseñado para docentes y estudiantes que combina:
- **Lienzo de Pizarra Digital Interactiva**: Permite dibujar, diagramar, insertar texto caligráfico, figuras geométricas, sellos pedagógicos y exportar trabajos en alta resolución.
- **Módulos de Capacitación Docente**: Seguimiento interactivo del avance formativo con barra de progreso en vivo.
- **Certificación de Acreditación**: Módulo de diplomas personalizados con soporte de impresión y exportación en PDF.
- **Sistema de Seguridad y Control de Acceso**: Demostración completa de arquitectura de rutas públicas, exclusivas para invitados, privadas generales y privadas restringidas por rol de administrador.

---

## 🛡️ Arquitectura de Seguridad y Protección de Rutas

La aplicación implementa un sistema multicapa para el control de acceso en el cliente utilizando **React Router DOM**:

```
                       ┌─────────────────────────┐
                       │      Usuario Navega     │
                       └────────────┬────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
         [ Ruta Pública (/) ]                [ Ruta Protegida ]
                  │                                   │
             (Acceso Libre)                 ¿Sesión cargando? (isLoading)
                                                      │
                                           ┌──────────┴──────────┐
                                          SÍ                     NO
                                           │                      │
                                   [ Loader Spinner ]      ¿Está autenticado?
                                                                  │
                                                        ┌─────────┴─────────┐
                                                       NO                   SÍ
                                                        │                    │
                                                Redirige a /login     ¿Requiere rol?
                                                (guarda state.from)          │
                                                                   ┌─────────┴─────────┐
                                                                  SÍ                   NO
                                                                   │                    │
                                                            ¿Tiene rol admin?    [ Renderiza Página ]
                                                                   │
                                                          ┌────────┴────────┐
                                                         SÍ                 NO
                                                          │                  │
                                                 [ Renderiza Admin ]    [ 403 Forbidden ]
```

### 1. `AuthContext` (Manejo Centralizado de Sesión)
- **Persistencia Libre de Parpadeos (*Flicker-Free*)**: Al recargar la página, se lee el estado de sesión desde `localStorage` antes de renderizar las rutas protegidas, evitando redirecciones erróneas hacia el login durante la hidratación.
- **Estado Global**: Expone `user`, `isAuthenticated`, `isLoading`, `login()` y `logout()`.

### 2. `PublicRoute` & `GuestRoute` (Rutas de Invitado)
- Protege rutas como `/login` y `/registro`.
- Si un usuario ya autenticado intenta acceder al formulario de login, `GuestRoute` lo intercepta y redirige automáticamente hacia `/dashboard`.

### 3. `PrivateRoute` (Protección de Rutas Autenticadas y RBAC)
- **Redirección con Memoria de Origen (`state.from`)**: Si un usuario no autenticado intenta ingresar a una ruta privada (ej. `/dashboard` o `/perfil`), es enviado al `/login` conservando la ruta previa en el estado de navegación. Al iniciar sesión, es devuelto automáticamente a la URL que intentaba visitar.
- **Control de Roles (`allowedRoles`)**: Si la ruta requiere privilegios especiales (como `admin`) y el usuario logueado posee el rol regular `usuario`, se le presenta la vista **403 Forbidden** sin expulsarlo de su sesión.

### 4. Manejo de Errores y Páginas Especiales
- **403 Forbidden (`ForbiddenPage`)**: Pantalla temática de advertencia cuando el usuario no tiene permisos suficientes, con botón de retorno al Dashboard.
- **404 Not Found (`NotFoundPage`)**: Atrapa cualquier ruta inexistente mediante la ruta comodín `*`.

---

## 👥 Estructura de Roles y Permisos (RBAC)

| Ruta | Tipo de Acceso | Rol Requerido | Comportamiento si no cumple |
| :--- | :--- | :--- | :--- |
| `/` | Pública | Cualquiera | Acceso permitido a todos |
| `/login` | Solo Invitado | No autenticado | Redirige a `/dashboard` si ya inició sesión |
| `/registro` | Solo Invitado | No autenticado | Redirige a `/dashboard` si ya inició sesión |
| `/dashboard` | Privada | `usuario` o `admin` | Redirige a `/login` con `state.from` |
| `/perfil` | Privada | `usuario` o `admin` | Redirige a `/login` con `state.from` |
| `/perfil/configuracion` | Privada | `usuario` o `admin` | Redirige a `/login` con `state.from` |
| `/dashboard/usuarios` | Privada Admin | `admin` | Muestra pantalla **403 Forbidden** |

> 💡 **Tip de prueba**: En el formulario de inicio de sesión (`/login`), se incluye un selector de **Simulación de Rol** para alternar fácilmente entre `Docente / Estudiante (Rol: usuario)` y `Administrador del Sistema (Rol: admin)`.

---

## 🚀 Funcionalidades de la Plataforma

### 1. 🖌️ Pizarra Interactiva (`InteractiveBoard`)
- **3 Tipos de Pizarra de Fondo**:
  - ⬜ **Acrílica**: Fondo blanco con marcadores de colores oscuros/vibrantes.
  - 🟩 **Tiza Clásica**: Pizarrón verde escolar con trazo estilo tiza pastel.
  - 🟦 **Blueprint**: Fondo técnico cuadriculado estilo plano de ingeniería.
- **5 Tipos de Guías de Fondo**:
  - En blanco, Cuadrícula milimetrada, Renglones docentes, Puntos e Isométrica.
- **Herramientas de Trazado**:
  - Pluma libre, Línea recta, Flecha directriz, Rectángulo y Círculo (con soporte de relleno o solo contorno).
  - Borrador con selector de grosor.
- **Editor de Texto WYSIWYG**:
  - Inserción de textos directamente sobre el lienzo con múltiples tipografías (Moderna sans-serif, Caligrafía docente cursiva, Clásica serif y Monoespaciada/fórmulas).
- **Sellos Pedagógicos**:
  - Estampas rápidas de evaluación docente: ⭐ Excelente, 💡 Idea Clave, ⚠️ Importante, ❓ Pregunta, ✅ Correcto, 🎯 Objetivo.
- **Gestión Avanzada del Lienzo**:
  - Carga de imágenes locales para realizar anotaciones encima.
  - Historial infinito de Deshacer / Rehacer (*Undo / Redo*).
  - Modo Pantalla Completa (*Fullscreen*).
  - Descarga instantánea del lienzo en formato PNG de alta resolución.

### 2. 📚 Módulos del Curso y Progreso
- Lista de módulos formativos sobre diagramación, técnicas de tiza, pizarras digitales y método Cornell.
- Marcado interactivo completado/pendiente con cálculo porcentual dinámico.

### 3. 🎓 Perfil Docente y Certificación Oficial
- Ficha de información profesional del docente y resumen de pizarras dominadas.
- Visualizador de **Certificado de Acreditación Docente** con firma digital y fecha de emisión automática.
- Botón directo para **Imprimir o Guardar en PDF** con diseño adaptado a medios de impresión (`@media print`).

### 4. ⚙️ Preferencias y Configuración
- Personalización del tipo de pizarra por defecto, densidad de guías, autoguardado de trazos y modo de alto contraste para proyección en proyector o aula.

### 5. 👑 Panel de Administración de Usuarios (`/dashboard/usuarios`)
- Tabla interactiva para administrar usuarios y docentes.
- Capacidad de alternar roles de usuario a administrador en tiempo real con notificaciones toast.

---

## 📁 Estructura del Proyecto

```text
pagina prueba seguridad/
├── README.md                      # Documentación principal del repositorio
└── pizzaras/                      # Código fuente de la aplicación React + Vite
    ├── package.json               # Dependencias y scripts
    ├── vite.config.js             # Configuración de Vite
    ├── index.html                 # Punto de entrada HTML5
    └── src/
        ├── main.jsx               # Renderizado del root de React
        ├── App.jsx                # Componente principal con Providers
        ├── App.css                # Estilos base
        ├── index.css              # Sistema de diseño y estilos globales
        ├── shared/                # Módulos y utilidades compartidas
        │   ├── context/
        │   │   ├── auth-context.jsx   # Estado global de autenticación y roles
        │   │   └── toast-context.jsx  # Sistema de notificaciones toast
        │   ├── routing/
        │   │   ├── app-router.jsx     # Definición de rutas de la aplicación
        │   │   ├── private-route.jsx  # Guardián de rutas privadas y roles
        │   │   ├── guest-route.jsx    # Guardián para usuarios no autenticados
        │   │   └── public-route.jsx   # Contenedor de rutas públicas
        │   └── components/
        │       ├── layout/navbar.jsx  # Barra de navegación con estado de auth
        │       └── ui/                # Botones, inputs y componentes base
        ├── pages/
        │   ├── public/                # Vistas de acceso público / invitados
        │   │   ├── home-page.jsx      # Página de inicio
        │   │   ├── login-page.jsx     # Inicio de sesión con selector de rol
        │   │   └── register-page.jsx  # Registro de cuenta
        │   └── private/               # Vistas protegidas
        │       ├── dashboard-page.jsx # Pizarra interactiva y cursos
        │       ├── profile-page.jsx   # Perfil y certificado de acreditación
        │       ├── configuracion-page.jsx # Preferencias de pizarra
        │       ├── admin-usuarios-page.jsx# Panel de administración (Solo Admin)
        │       ├── forbidden-page.jsx # Error 403 (Acceso denegado)
        │       └── not-found-page.jsx # Error 404 (Página no encontrada)
        └── components/
            ├── auth/                  # Formularios de login y registro
            ├── dashboard/             # Componente de pizarra y estadísticas
            └── home/                  # Secciones de la landing page
```

---

## 🛠️ Tecnologías Utilizadas

- **Core**: [React 19](https://react.dev/)
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Diseño y Estilos**: CSS3 Vanilla (Variables CSS, Flexbox, CSS Grid, Glassmorphism, Print Styles)
- **Persistencia**: Web Storage API (`localStorage`)
- **Lienzo Gráfico**: HTML5 Canvas API

---

## 💻 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Git](https://git-scm.com/)

### Pasos de ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/danielramirez272006-arch/pizzara.git
   cd pizzara
   ```

2. **Acceder a la carpeta del proyecto:**
   ```bash
   cd pizzaras
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   Ingresa a `http://localhost:5173` (o la dirección indicada en la terminal).

---

## 🧭 Flujo de Navegación y Demostración

1. **Ingreso Inicial**: Navega a `/` para explorar la página pública.
2. **Inicio de Sesión**:
   - Pulsa en **Iniciar Sesión**.
   - Selecciona el rol `Docente / Estudiante (Rol: usuario)` para ingresar al `/dashboard`.
3. **Pizarra**: Experimenta cambiando de fondo (Acrílica, Tiza, Blueprint), dibuja con diferentes herramientas, escribe textos, inserta sellos y descarga el resultado.
4. **Verificación de Seguridad (403 Forbidden)**:
   - Estando como usuario regular, intenta acceder manualmente a `/dashboard/usuarios`.
   - Se mostrará la pantalla de **403 Acceso Denegado**.
5. **Acceso como Administrador**:
   - Cierra sesión desde el menú de usuario.
   - Inicia sesión seleccionando el rol `Administrador del Sistema (Rol: admin)`.
   - Accede a la ruta `/dashboard/usuarios` para gestionar los usuarios y cambiar roles en la tabla.
6. **Redirección Inteligente**:
   - Cierra sesión e intenta acceder directamente a `/perfil`.
   - El sistema te enviará a `/login` con un aviso indicando la ruta solicitada. Tras iniciar sesión, serás redirigido inmediatamente a `/perfil`.
