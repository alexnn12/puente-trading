# Aplicación de Seguimiento de Acciones

Una aplicación web moderna desarrollada con Next.js que permite a los usuarios seguir y gestionar sus acciones favoritas del mercado bursátil en tiempo real.

## Requisitos del Sistema

### Requisitos Mínimos
- Node.js 18.0 o superior
- npm 8.0 o superior (o yarn/pnpm equivalente)
- PostgreSQL 12.0 o superior (la versión actual usa Neon.tech como proveedor de PostgreSQL)
- Cuenta en Alpha Vantage (API gratuita disponible)
- Docker (opcional, para despliegue con contenedores)

### Variables de Entorno Requeridas
- `DATABASE_URL` - URL de conexión a la base de datos PostgreSQL (formato: postgresql://usuario:contraseña@host:puerto/nombre_bd)
- `JWT_SECRET` - Clave secreta para la generación y verificación de tokens JWT (mínimo 32 caracteres)
- `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY` - Clave de API de Alpha Vantage para obtener datos financieros en tiempo real

### Despliegue con Docker
La aplicación incluye un Dockerfile para facilitar el despliegue en contenedores:
- Imagen base: Node.js 18 Alpine
- Puerto expuesto: 3000
- Optimizado para producción con dependencias mínimas
- Generación automática de Prisma client incluida

## Descripción de la Solución

Esta aplicación proporciona una plataforma completa para el seguimiento de acciones del mercado financiero, ofreciendo:

- **Dashboard Interactivo**: Visualización en tiempo real de precios de acciones populares (Apple, Google, Microsoft, Amazon, Tesla, Meta)
- **Sistema de Favoritos**: Los usuarios pueden guardar y gestionar sus acciones de interés
- **Autenticación**: Sistema completo de registro e inicio de sesión con JWT
- **Base de Datos**: Almacenamiento persistente con PostgreSQL y Prisma ORM
- **API de Datos Financieros**: Integración con Alpha Vantage para obtener datos de mercado actualizados
- **Caché**: Sistema de caché que actualiza datos cada 24 horas para optimizar consultas y costos de API
- **Interfaz Responsiva**: Diseño con componentes UI reutilizables

## Video Demostrativo

Puedes ver una demostración completa de la aplicación en funcionamiento en el siguiente video:

[![Video Demostrativo - Aplicación de Seguimiento de Acciones](https://img.youtube.com/vi/qWm0qpsqLaE/0.jpg)](https://www.youtube.com/watch?v=qWm0qpsqLaE)

**[Ver Video en YouTube](https://www.youtube.com/watch?v=qWm0qpsqLaE)**




## Documentación de la API

### Especificación OpenAPI (Swagger)
La aplicación incluye una especificación completa de la API en formato OpenAPI 3.0 disponible en el archivo `swagger.json`. 

### Colección de Postman
También se incluye una colección completa de Postman (`Puente API.postman_collection.json`) con todos los endpoints documentados y ejemplos de uso. Esta colección incluye:

### Estructura de la API

La aplicación cuenta con los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Inicio de sesión de usuarios
- `POST /api/auth/register` - Registro de nuevos usuarios

### Acciones
- `GET /api/acciones?symbol={SYMBOL}` - Obtiene datos de una acción específica
  - Parámetros: `symbol` (requerido) - Símbolo de la acción (ej: AAPL, GOOGL)
  - Respuesta: Precio actual, cambios diarios/semanales, volumen, apertura, máximo, mínimo

### Favoritos
- `GET /api/usuario/favorito` - Obtiene favoritos del usuario autenticado
- `POST /api/usuario/favorito` - Agrega una acción a favoritos
- `DELETE /api/usuario/favorito` - Elimina una acción de favoritos

### Usuarios
- `GET /api/usuario/` - Obtiene información del perfil del usuario autenticado
- `GET /api/usuario/listado` - Obtiene listado de usuarios (solo administradores)
- `PUT /api/usuario/status` - Actualiza estado de activación de usuarios (solo administradores)

### Dependencias principales

#### Frontend
- **Next.js 15.3.2** - Framework React con App Router para SSR/SSG
- **React 19.0.0** - Biblioteca principal para interfaces de usuario
- **Tailwind CSS 4** - Framework CSS utility-first para estilos
- **shadcn/ui** - Componentes UI accesibles basados en Radix UI
- **Lucide React 0.511.0** - Iconos SVG optimizados
- **Zustand 5.0.5** - Manejo de estado global ligero

#### Backend y Base de Datos
- **Prisma 6.8.2** - ORM moderno con type safety
- **bcrypt 6.0.0** - Hash seguro de contraseñas
- **jsonwebtoken 9.0.2** - Autenticación JWT

#### Componentes UI (Radix UI)
- **@radix-ui/react-avatar 1.1.10** - Componente avatar accesible
- **@radix-ui/react-dialog 1.1.14** - Modales y diálogos
- **@radix-ui/react-dropdown-menu 2.1.15** - Menús desplegables
- **@radix-ui/react-label 2.1.7** - Etiquetas de formulario
- **@radix-ui/react-navigation-menu 1.2.13** - Navegación principal
- **@radix-ui/react-slot 1.2.3** - Composición de componentes
- **Sonner 2.0.5** - Sistema de notificaciones toast

#### Herramientas de Desarrollo
- **Turbopack** - Bundler de desarrollo ultra-rápido
- **PostCSS** - Procesador CSS para Tailwind

## Decisiones Técnicas y Trade-offs

### Arquitectura y Framework

#### Next.js 15 con App Router
- **Decisión**: Utilizar Next.js 15 con App Router
- **Ventajas**: SSR/SSG integrado, optimización automática, code splitting, routing basado en archivos, API Routes, mejor SEO
- **Trade-offs**: Mayor complejidad, vendor lock-in con Vercel, curva de aprendizaje, bundle size mayor

#### Prisma como ORM
- **Decisión**: Usar Prisma como ORM principal
- **Ventajas**: Type safety con TypeScript, migraciones automáticas, excelente DX, generación de tipos
- **Trade-offs**: Overhead en consultas complejas, bundle size mayor, dependencia de generación de código

#### Tailwind CSS + shadcn/ui
- **Decisión**: Combinar Tailwind con componentes shadcn/ui
- **Ventajas**: Desarrollo rápido, componentes accesibles, consistencia visual, bundle optimizado
- **Trade-offs**: Curva de aprendizaje, dependencia de utilidades, posible verbosidad en HTML

#### Client-Side Rendering para Dashboard
- **Decisión**: CSR para el dashboard
- **Ventajas**: Interactividad inmediata, mejor para datos dinámicos, simplicidad en auth
- **Trade-offs**: Carga inicial lenta, SEO limitado, dependencia de JavaScript

#### Estructura por Funcionalidad
- **Decisión**: Organizar código por páginas/rutas
- **Ventajas**: Mejor organización, localización fácil, preparado para micro-frontends
- **Trade-offs**: Posible duplicación, menos reutilización