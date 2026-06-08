# Sistema de Gestión de Stock (React Native & Supabase)

Aplicación móvil desarrollada en **React Native (Expo)** para la gestión completa de inventario. Permite crear productos, visualizarlos, filtrarlos mediante un sistema dinámico de etiquetas (Tags) y llevar un control exacto de movimientos de ingreso y egreso de stock con persistencia remota en Supabase.

## Características Principales
- **Navegación Robusta**: Implementación fluida utilizando `react-navigation` (Native Stack Navigator) para un flujo de pantallas intuitivo (Home -> Lista -> Detalle / Movimientos).
- **Control de Movimientos de Stock**: Flujo unificado para registrar entradas y salidas de mercadería, asegurando la integridad de los datos.
- **Persistencia Remota y RLS (Row Level Security)**: Conectada directamente a Supabase utilizando la API oficial de Javascript `@supabase/supabase-js`. Incluye autenticación de usuarios y persistencia de sesión a través de `AsyncStorage`.
- **Filtros Dinámicos en Tiempo Real**: Búsqueda por texto (nombre, descripción, código) y por "Tags" categorizados autogenerados.
- **Theming Centralizado**: Utiliza un Context personalizado (`ThemeContext`) y un archivo maestro de diseño (`constants/theme.ts`) que habilita el soporte a Modo Claro/Oscuro de forma global y reutilización de estilos (espaciados, tipografías, border-radius).
- **Código Organizado**: Arquitectura escalable dividida en componentes reutilizables, vistas, contextos, servicios de API y constantes.

## Estructura de Directorios (Arquitectura)
```
/app
 ┣ /src
 ┃ ┣ /api           -> Configuración del cliente Supabase
 ┃ ┣ /components    -> Componentes UI reutilizables (Alertas personalizadas, Wrappers de animación, etc)
 ┃ ┣ /constants     -> Archivos maestros de Theming (colores, fuentes, espacios)
 ┃ ┣ /context       -> Contextos de React (ThemeContext, AuthContext para manejo de sesión global)
 ┃ ┣ /navigation    -> Configuraciones de React Navigation (RootNavigator, MainNavigator)
 ┃ ┣ /screens       -> Vistas separadas por dominios lógicos (Auth, Admin)
 ┃ ┗ /services      -> Controladores de llamadas a la Base de Datos (productService)
 ┣ App.tsx          -> Entry point de la aplicación que inicializa los providers globales
 ┗ app.json         -> Configuración del framework Expo
```

## Tecnologías Utilizadas
- **React Native** + **Expo SDK**
- **TypeScript**: Tipado seguro en modelos, interfaces de la base de datos y props.
- **React Navigation**: Para apilar (Stack) las vistas.
- **Supabase**: Backend-as-a-Service, Base de Datos PostgreSQL y Sistema de Autenticación.
- **AsyncStorage**: Para persistencia local de la sesión activa del usuario.

## Configuración y Ejecución

1. Clonar el repositorio.
2. Instalar las dependencias ejecutando:
   ```bash
   npm install
   ```
3. Configurar variables de entorno: Crear un archivo `.env` en la raíz copiando `.env.example` (si aplica) e insertando las credenciales `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Iniciar el servidor local:
   ```bash
   npx expo start --clear
   ```
