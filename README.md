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
- **Sistema de Favoritos Personalizado**: Los usuarios pueden guardar y gestionar sus acciones de interés
- **Autenticación Segura**: Sistema completo de registro e inicio de sesión con JWT
- **Base de Datos Robusta**: Almacenamiento persistente con PostgreSQL y Prisma ORM
- **API de Datos Financieros**: Integración con Alpha Vantage para obtener datos de mercado actualizados
- **Caché Inteligente**: Sistema de caché que actualiza datos cada 24 horas para optimizar consultas y costos de API
- **Interfaz Responsiva**: Diseño moderno con componentes UI reutilizables

## Guía de Uso Básico

### 1. Registro e Inicio de Sesión

#### Crear una Cuenta Nueva
1. Navega a la página de registro
2. Completa el formulario con:
   - Nombre completo
   - Dirección de email válida
   - Contraseña segura
3. Haz clic en "Registrarse"
4. Serás redirigido automáticamente al dashboard

#### Iniciar Sesión
1. Ve a la página de login
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"
4. Accederás al dashboard principal

### 2. Navegación del Dashboard

#### Vista Principal
- **Panel de Acciones**: Visualiza las 6 acciones más populares (AAPL, GOOGL, MSFT, AMZN, TSLA, META)
- **Información en Tiempo Real**: Precios actuales, cambios porcentuales y variaciones en dólares
- **Indicadores Visuales**: Colores verde/rojo para identificar ganancias/pérdidas rápidamente

#### Gestión de Favoritos
- **Agregar a Favoritos**: Haz clic en el ícono de estrella junto a cualquier acción
- **Ver Favoritos**: Accede a la sección "Mis Favoritos" en el menú lateral
- **Eliminar Favoritos**: Haz clic nuevamente en la estrella para quitar de favoritos

### 3. Perfil de Usuario

#### Acceder al Perfil
1. Haz clic en tu nombre en la barra superior
2. Selecciona "Perfil" del menú desplegable

#### Información Disponible
- **Datos Personales**: Nombre y email
- **Estado de Cuenta**: Activa/Inactiva
- **Rol**: Usuario o Administrador
- **Fecha de Registro**: Cuándo te uniste a la plataforma

### 4. Funciones de Administrador

#### Panel de Administración (Solo Administradores)
- **Gestión de Usuarios**: Ver lista completa de usuarios registrados
- **Control de Estado**: Activar/desactivar cuentas de usuario
- **Información Detallada**: Ver roles y fechas de registro de todos los usuarios

#### Acceder al Panel de Admin
1. Ve a tu perfil
2. Haz clic en "Administrar Usuarios" (solo visible para administradores)
3. Gestiona usuarios desde la tabla interactiva

### 5. Consejos de Uso

#### Optimización de la Experiencia
- **Actualización Automática**: Los datos se actualizan cada 24 horas automáticamente
- **Favoritos Personalizados**: Usa la función de favoritos para acceso rápido a tus acciones de interés
- **Navegación Móvil**: La aplicación es completamente responsiva para uso en dispositivos móviles

#### Seguridad
- **Cierre de Sesión**: Siempre cierra sesión al terminar, especialmente en dispositivos compartidos
- **Contraseñas Seguras**: Usa contraseñas fuertes y únicas
- **Tokens de Sesión**: Los tokens expiran automáticamente por seguridad

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

#### Validación Dual (Cliente y Servidor)
- **Decisión**: Validación en frontend y backend
- **Ventajas**: Mejor UX, seguridad robusta, menos requests innecesarios
- **Trade-offs**: Duplicación de lógica, mayor complejidad, posible inconsistencia

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