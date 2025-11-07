# 🎵 Buscador de Canciones y Artistas

## 📖 Descripción del Proyecto

**Buscador de Canciones y Artistas** es una aplicación web moderna desarrollada en React.js que permite a los usuarios buscar y explorar información detallada sobre canciones y artistas utilizando la API pública de iTunes. La aplicación ofrece una interfaz intuitiva y visualmente atractiva que facilita el descubrimiento de contenido musical.

### ¿Qué hace la aplicación?

La aplicación funciona como un motor de búsqueda musical que permite a los usuarios:

1. **Búsqueda de Contenido Musical**: Los usuarios pueden ingresar el nombre de una canción, artista o álbum en el campo de búsqueda y obtener resultados instantáneos de la base de datos de iTunes.

2. **Visualización de Resultados**: Cada resultado se presenta en una tarjeta informativa que incluye:
   - **Portada del álbum** en alta resolución
   - **Título de la canción**
   - **Nombre del artista**
   - **Nombre del álbum** (cuando está disponible)
   - **Enlace de vista previa** para escuchar un fragmento de la canción

3. **Experiencia de Usuario Mejorada**:
   - Indicadores visuales de carga durante las búsquedas
   - Mensajes informativos cuando no se encuentran resultados
   - Manejo robusto de errores con mensajes claros
   - Diseño completamente responsive que se adapta a cualquier dispositivo
   - Animaciones suaves y efectos visuales modernos

4. **Interactividad**: 
   - Búsqueda mediante botón o tecla Enter
   - Hover effects en las tarjetas que revelan un botón de reproducción
   - Enlaces directos a vistas previas de canciones en nuevas pestañas

### Flujo de Funcionamiento

1. El usuario ingresa un término de búsqueda en el campo de texto
2. Al presionar "Buscar" o Enter, la aplicación realiza una petición HTTP a la API de iTunes
3. Mientras se procesa la búsqueda, se muestra un indicador de carga
4. Los resultados se presentan en un grid responsive de tarjetas
5. El usuario puede interactuar con cada tarjeta para ver detalles o escuchar previews

## 🎯 Características Principales

- ✅ **Búsqueda en Tiempo Real**: Búsqueda instantánea de canciones y artistas
- ✅ **Interfaz Moderna**: Diseño con gradientes, glassmorphism y animaciones fluidas
- ✅ **Totalmente Responsive**: Optimizado para móviles, tablets y escritorio
- ✅ **Manejo de Estados Avanzado**: Control completo de carga, errores y resultados vacíos
- ✅ **Vista Previa de Canciones**: Enlaces directos a fragmentos de audio de iTunes
- ✅ **Sin Dependencias Externas de Estado**: Implementación pura con `useState` únicamente
- ✅ **Accesibilidad**: Atributos ARIA y navegación por teclado
- ✅ **Optimización de Imágenes**: Carga de portadas en alta resolución

## 🛠️ Stack Tecnológico

### Frontend
- **React.js 19.1.1** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite 7.1.7** - Herramienta de construcción y desarrollo ultrarrápida
- **Bootstrap 5.3.8** - Framework CSS para diseño responsive y componentes UI

### API Externa
- **iTunes Search API** - API pública de Apple para búsqueda de contenido multimedia

### Herramientas de Desarrollo
- **ESLint** - Linter para mantener calidad de código
- **Node.js** - Entorno de ejecución de JavaScript

## 📡 API Utilizada: iTunes Search API

### Información General

Este proyecto utiliza la **iTunes Search API** de Apple, una API REST pública y gratuita que proporciona acceso a la base de datos de contenido multimedia de iTunes.

**URL Base:** `https://itunes.apple.com/search`

### Características de la API

- ✅ **Pública y Gratuita**: No requiere autenticación ni API key
- ✅ **Sin Límites Estrictos**: Uso libre para proyectos personales y educativos
- ✅ **Datos Ricos**: Proporciona información completa sobre canciones, artistas y álbumes
- ✅ **Vistas Previa**: Incluye URLs de fragmentos de audio para previews

### Parámetros Utilizados

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `term` | Dinámico | Término de búsqueda ingresado por el usuario |
| `media` | `music` | Filtra resultados solo a contenido musical |
| `limit` | `20` | Máximo de resultados a retornar |

### Ejemplo de Petición

```
GET https://itunes.apple.com/search?term=beatles&media=music&limit=20
```

### Estructura de Respuesta

La API retorna un objeto JSON con la siguiente estructura:

```json
{
  "resultCount": 20,
  "results": [
    {
      "trackId": 123456789,
      "artistName": "The Beatles",
      "trackName": "Hey Jude",
      "collectionName": "The Beatles 1967-1970",
      "artworkUrl100": "https://...",
      "previewUrl": "https://...",
      ...
    }
  ]
}
```

### Documentación Oficial

[Documentación de iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

## 📦 Instalación y Configuración

### Requisitos Previos

- **Node.js** versión 14 o superior
- **npm** (incluido con Node.js) o **yarn**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd mi-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:5173`
   - O el puerto que Vite asigne automáticamente

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Genera una versión optimizada para producción |
| `npm run preview` | Previsualiza la versión de producción localmente |
| `npm run lint` | Ejecuta el linter para verificar calidad de código |

## 🎮 Guía de Uso

### Búsqueda Básica

1. **Ingresar término de búsqueda**
   - Escribe el nombre de una canción, artista o álbum en el campo de búsqueda
   - Ejemplos: "Beatles", "Bohemian Rhapsody", "Abbey Road"

2. **Ejecutar búsqueda**
   - Presiona el botón "Buscar" o la tecla Enter
   - Observa el indicador de carga mientras se procesa la petición

3. **Explorar resultados**
   - Los resultados aparecen en tarjetas organizadas en un grid
   - Pasa el cursor sobre una tarjeta para ver el botón de reproducción
   - Haz clic en "Escuchar Vista Previa" para abrir el fragmento de audio

### Funcionalidades Interactivas

- **Búsqueda con Enter**: Presiona Enter en el campo de búsqueda para buscar rápidamente
- **Hover Effects**: Pasa el cursor sobre las tarjetas para ver efectos visuales
- **Enlaces de Preview**: Los botones de vista previa abren el audio en una nueva pestaña
- **Cerrar Errores**: Haz clic en la X para cerrar mensajes de error

## 🏗️ Arquitectura y Estructura del Proyecto

### Estructura de Directorios

```
mi-app/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/         # Recursos (imágenes, iconos)
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos del componente principal
│   ├── index.css       # Estilos globales
│   └── main.jsx        # Punto de entrada de la aplicación
├── index.html          # Plantilla HTML
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
└── README.md           # Este archivo
```

### Componentes Principales

#### App.jsx
Componente funcional principal que contiene toda la lógica de la aplicación:
- **Estados**: Manejo de búsqueda, resultados, carga y errores
- **Funciones**: `handleSearch()` para peticiones HTTP y `handleKeyPress()` para eventos de teclado
- **Renderizado**: JSX que estructura la interfaz de usuario

### Flujo de Datos

```
Usuario → Input → handleSearch() → fetch(API) → setResults() → Renderizado
```

## 🔧 Implementación Técnica

### Manejo de Estado

La aplicación utiliza **únicamente** el hook `useState` de React para manejar todos los estados:

- `searchTerm`: Término de búsqueda actual
- `results`: Array de resultados de la API
- `loading`: Estado de carga de la petición
- `error`: Mensajes de error
- `hasSearched`: Flag para controlar mensajes de "sin resultados"

### Peticiones HTTP

Las peticiones se realizan con `fetch()` nativo de JavaScript dentro de la función `handleSearch()`, que se ejecuta como manejador de eventos del botón. **No se utiliza `useEffect`** según los requisitos del proyecto.

### Manejo de Errores

- Validación de entrada antes de realizar la petición
- Try-catch para capturar errores de red o de la API
- Mensajes de error descriptivos para el usuario
- Fallbacks para imágenes que no cargan

### Optimizaciones

- **Lazy Loading**: Imágenes cargadas bajo demanda
- **Error Handling**: Manejo de errores de carga de imágenes
- **Responsive Images**: Uso de URLs de alta resolución cuando están disponibles
- **Animaciones Optimizadas**: Uso de CSS transforms para mejor rendimiento

## 📱 Diseño Responsive

La aplicación está diseñada siguiendo principios de **Mobile-First** y se adapta perfectamente a:

- 📱 **Móviles** (< 576px): 1 columna, diseño vertical optimizado
- 📱 **Tablets** (576px - 992px): 2 columnas, mejor aprovechamiento del espacio
- 💻 **Desktop** (992px - 1200px): 3 columnas, grid equilibrado
- 🖥️ **Large Desktop** (> 1200px): 4 columnas, máximo aprovechamiento

### Breakpoints de Bootstrap 5

- `col-12`: Móvil (100% ancho)
- `col-sm-6`: Tablet pequeña (50% ancho)
- `col-md-4`: Tablet grande (33% ancho)
- `col-lg-3`: Desktop (25% ancho)

## 🎨 Características de Diseño

### Paleta de Colores

- **Gradiente Principal**: Azul (#667eea) a Púrpura (#764ba2)
- **Gradiente Secundario**: Rosa (#f093fb) a Rojo (#f5576c)
- **Fondo Oscuro**: Azul oscuro degradado (#1e3c72 a #2a5298)

### Efectos Visuales

- **Glassmorphism**: Efecto de vidrio esmerilado en el formulario de búsqueda
- **Hover Effects**: Transformaciones y sombras al pasar el cursor
- **Animaciones**: Fade-in, bounce, y transiciones suaves
- **Gradientes**: Textos y fondos con degradados modernos

## 📝 Notas de Desarrollo

### Decisiones de Diseño

1. **Sin useEffect**: La aplicación cumple con el requisito de no usar `useEffect`, manejando todas las peticiones HTTP mediante eventos de usuario.

2. **Componente Único**: Toda la lógica está centralizada en un solo componente para simplicidad y claridad educativa.

3. **Bootstrap 5**: Se utiliza Bootstrap para el sistema de grid y componentes base, complementado con CSS personalizado para efectos avanzados.

4. **API Pública**: iTunes Search API fue elegida por ser gratuita, sin autenticación y con datos completos.

### Mejoras Futuras Potenciales

- Implementación de caché de resultados
- Búsqueda con debounce para mejor UX
- Filtros adicionales (género, año, etc.)
- Favoritos y historial de búsquedas
- Modo oscuro/claro
- Integración con más APIs musicales

## 🐛 Solución de Problemas

### Problemas Comunes

**La aplicación no carga resultados**
- Verifica tu conexión a internet
- Comprueba que la API de iTunes esté accesible
- Revisa la consola del navegador para errores

**Las imágenes no se muestran**
- Algunas canciones pueden no tener portadas disponibles
- El sistema tiene fallback automático a imágenes placeholder

**Errores de CORS**
- La API de iTunes no debería presentar problemas de CORS
- Si ocurren, verifica que estés usando la URL correcta

## 📸 Capturas de Pantalla

> **Nota:** Se recomienda agregar capturas de pantalla o un video corto mostrando:
> - La interfaz principal con el formulario de búsqueda
> - Resultados de búsqueda con las tarjetas
> - Vista responsive en diferentes dispositivos
> - Efectos hover y animaciones

## 👥 Contribuciones

Este proyecto fue desarrollado como proyecto académico para demostrar:
- Manejo de estados en React
- Peticiones HTTP asíncronas
- Manejo de eventos
- Diseño responsive
- Integración con APIs externas

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos y de aprendizaje.

## 🙏 Agradecimientos

- **Apple** por proporcionar la iTunes Search API de forma pública
- **React Team** por el excelente framework
- **Bootstrap Team** por el sistema de diseño responsive

---

**Desarrollado con ❤️ para el aprendizaje de React.js**

**¡Disfruta buscando tu música favorita! 🎶**
