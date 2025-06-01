# Aplicación de Seguimiento de Acciones

Una aplicación web moderna desarrollada con Next.js que permite a los usuarios seguir y gestionar sus acciones favoritas del mercado bursátil en tiempo real.

## Descripción de la Solución

Esta aplicación proporciona una plataforma completa para el seguimiento de acciones del mercado financiero, ofreciendo:

- **Dashboard Interactivo**: Visualización en tiempo real de precios de acciones populares (Apple, Google, Microsoft, Amazon, Tesla, Meta)
- **Sistema de Favoritos Personalizado**: Los usuarios pueden guardar y gestionar sus acciones de interés
- **Autenticación Segura**: Sistema completo de registro e inicio de sesión con JWT
- **Base de Datos Robusta**: Almacenamiento persistente con PostgreSQL y Prisma ORM
- **API de Datos Financieros**: Integración con Alpha Vantage para obtener datos de mercado actualizados
- **Caché Inteligente**: Sistema de caché que actualiza datos cada 24 horas para optimizar consultas y costos de API
- **Interfaz Responsiva**: Diseño moderno con componentes UI reutilizables

## Estructura de la API

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


## Requisitos del Sistema

### Requisitos Mínimos
- Node.js 18.0 o superior
- npm 8.0 o superior (o yarn/pnpm equivalente)
- PostgreSQL 12.0 o superior
- Cuenta en Alpha Vantage (API gratuita disponible)

### Variables de Entorno Requeridas
- `DATABASE_URL` - URL de conexión a la base de datos PostgreSQL (formato: postgresql://usuario:contraseña@host:puerto/nombre_bd)
- `JWT_SECRET` - Clave secreta para la generación y verificación de tokens JWT (mínimo 32 caracteres)
- `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY` - Clave de API de Alpha Vantage para obtener datos financieros en tiempo real


