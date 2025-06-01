# Aplicación de Seguimiento de Acciones

Una aplicación web moderna desarrollada con Next.js que permite a los usuarios seguir y gestionar sus acciones favoritas del mercado bursátil en tiempo real.

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

## Decisiones Técnicas y Trade-offs

### Arquitectura y Framework

#### Next.js 14 con App Router
**Decisión**: Utilizar Next.js 15 con el nuevo App Router en lugar de Pages Router
**Ventajas contra React puro**:
- Server-Side Rendering (SSR) y Static Site Generation (SSG) integrados
- Optimización automática de imágenes y fuentes
- Code splitting automático y lazy loading
- Routing basado en sistema de archivos
- API Routes integradas para backend
- Mejor SEO y rendimiento inicial comparado con SPAs de React
- Hot reloading y Fast Refresh mejorados
- Optimizaciones de producción automáticas

**Trade-offs**:
- Mayor complejidad comparado con React vanilla
- Vendor lock-in con Vercel (aunque funciona en otros proveedores)
- Curva de aprendizaje adicional sobre conceptos específicos de Next.js
- Bundle size mayor debido a funcionalidades adicionales del framework

#### Prisma como ORM
**Decisión**: Usar Prisma en lugar de consultas SQL directas o ORMs alternativos
**Ventajas**:
- Type safety completo con TypeScript
- Migraciones automáticas y versionado de esquema
- Excelente developer experience con Prisma Studio
- Generación automática de tipos

**Trade-offs**:
- Overhead adicional en consultas complejas
- Tamaño del bundle ligeramente mayor
- Dependencia de herramientas de generación de código

### Autenticación y Seguridad

#### JWT con localStorage
**Decisión**: Almacenar tokens JWT en localStorage en lugar de cookies httpOnly
**Ventajas**:
- Simplicidad en la implementación del cliente
- Funciona bien con SPAs y APIs REST
- Control total sobre el ciclo de vida del token

**Trade-offs**:
- Vulnerable a ataques XSS
- No se envía automáticamente en requests
- Requiere manejo manual de expiración

#### Validación en Cliente y Servidor
**Decisión**: Implementar validación tanto en frontend como backend
**Ventajas**:
- Mejor UX con feedback inmediato
- Seguridad robusta con validación del servidor
- Reducción de requests innecesarios

**Trade-offs**:
- Duplicación de lógica de validación
- Mayor complejidad de mantenimiento
- Posible inconsistencia entre validaciones

### Base de Datos y APIs Externas

#### Alpha Vantage API
**Decisión**: Usar Alpha Vantage como fuente de datos financieros
**Ventajas**:
- API gratuita con límites razonables
- Datos históricos y en tiempo real
- Documentación completa y estable

**Trade-offs**:
- Límite de 25 requests por día en plan gratuito
- Latencia variable dependiendo de la carga
- Dependencia de servicio externo

#### Caché en Memoria vs Base de Datos
**Decisión**: No implementar caché persistente para datos de acciones
**Ventajas**:
- Simplicidad en la implementación
- Datos siempre actualizados
- Menos complejidad en invalidación de caché

**Trade-offs**:
- Mayor latencia en requests repetidos
- Consumo innecesario de límites de API
- Experiencia de usuario más lenta

### Frontend y UI

#### Tailwind CSS + shadcn/ui
**Decisión**: Combinar Tailwind CSS con componentes de shadcn/ui
**Ventajas**:
- Desarrollo rápido con utilidades predefinidas
- Componentes accesibles y bien diseñados
- Consistencia visual automática
- Bundle size optimizado con purging

### Rendimiento y Optimización

#### Client-Side Rendering para Dashboard
**Decisión**: Usar CSR para el dashboard en lugar de SSR
**Ventajas**:
- Interactividad inmediata después de la carga inicial
- Mejor experiencia para datos que cambian frecuentemente
- Simplicidad en el manejo de autenticación

**Trade-offs**:
- Tiempo de carga inicial más lento
- SEO limitado para contenido del dashboard
- Dependencia de JavaScript para funcionalidad


### Escalabilidad y Mantenimiento

#### Estructura de Carpetas por Funcionalidad
**Decisión**: Organizar código por páginas/rutas en lugar de por tipo de archivo
**Ventajas**:
- Mejor organización para equipos grandes
- Facilita la localización de código relacionado
- Preparado para micro-frontends futuros

**Trade-offs**:
- Posible duplicación de componentes similares
- Menos reutilización de código entre módulos

#### Manejo de Errores Centralizado
**Decisión**: Implementar manejo de errores a nivel de componente
**Ventajas**:
- Control granular sobre diferentes tipos de errores
- Mejor UX con mensajes contextuales
- Facilita el debugging

**Trade-offs**:
- Código repetitivo en manejo de errores
- Posible inconsistencia en mensajes de error
- Mayor complejidad en testing

