# PolisConsult - Sitio Web Profesional

Sitio web profesional de consultoría política especializado en estrategias para campañas municipales e intendencias.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Animaciones Suaves**: Implementadas con AOS (Animate On Scroll)
- **Validación de Formularios**: Validación en tiempo real con feedback visual
- **Arquitectura Modular**: JavaScript modularizado para mejor mantenibilidad
- **SEO Optimizado**: Meta tags completos para mejor posicionamiento
- **Accesibilidad**: Etiquetas ARIA y navegación por teclado

## 📁 Estructura del Proyecto

```
polisconsult-website/
├── index.html                 # Página principal
├── page.html                  # Archivo original (backup)
├── server.js                  # Servidor de desarrollo Node.js
├── package.json              # Configuración del proyecto
├── README.md                 # Documentación completa
├── INSTALL.md                # Guía de instalación rápida
├── .gitignore                # Archivos ignorados por Git
├── assets/
│   ├── css/
│   │   ├── styles.css       # Estilos personalizados
│   │   └── components/      # Componentes CSS (futuro)
│   ├── js/
│   │   ├── main.js          # Punto de entrada principal (ESM)
│   │   ├── modules/
│   │   │   ├── animations.js    # Gestión de animaciones AOS
│   │   │   ├── icons.js         # Gestión de íconos Feather
│   │   │   └── form-validation.js # Validación de formularios
│   │   └── vendor/          # Librerías externas (futuro)
│   └── images/              # Imágenes del sitio
│       └── favicon.ico      # Favicon del sitio
└── pages/                   # Páginas adicionales
    ├── acerca-de.html      # Página "Acerca de nosotros"
    └── servicios.html      # Página detallada de servicios
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **Tailwind CSS**: Framework CSS utilitario
- **JavaScript ES6+**: Módulos modernos
- **AOS**: Animaciones al hacer scroll
- **Feather Icons**: Sistema de íconos

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 14+
- Navegador moderno con soporte ES6+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd polisconsult-website

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Desarrollo

```bash
# Servidor local
npm run dev

# Construir para producción
npm run build

# Ejecutar lints
npm run lint
```

## 📱 Funcionalidades

### Páginas del Sitio

- **Página Principal** (`index.html`): Landing page con hero, servicios, equipo y contacto
- **Acerca de Nosotros** (`pages/acerca-de.html`): Historia, misión, visión, valores y equipo detallado
- **Servicios** (`pages/servicios.html`): Detalles completos de cada servicio ofrecido

### Formulario de Contacto

- Validación en tiempo real
- Mensajes de error descriptivos
- Indicador de carga
- Mensajes de éxito/error
- **Envío de emails reales** vía EmailJS

#### 📧 Configuración de EmailJS

Para que los formularios envíen emails reales:

1. **Crear cuenta gratuita**: [EmailJS.com](https://www.emailjs.com/)
2. **Configurar servicio**: Gmail, Outlook, o cualquier proveedor
3. **Crear template**: Usa las variables disponibles
4. **Actualizar configuración** en `assets/js/modules/form-validation.js`

**Variables del template**:

- `{{from_name}}` - Nombre del remitente
- `{{from_email}}` - Email del remitente
- `{{telefono}}` - Teléfono
- `{{cargo}}` - Cargo/organización
- `{{message}}` - Mensaje del formulario

**Destino**: `info@polisconsult.com`

#### 🔐 **Seguridad de las Claves**

- ✅ **Claves públicas de EmailJS**: Diseñadas para ser públicas
- ✅ **Archivo config.js**: Excluido del control de versiones
- ❌ **Nunca subir claves reales** a repositorios públicos
- ⚠️ **Riesgo**: Consumo de cuota mensual si se abusa

### Navegación

- Menú responsive
- Scroll suave a secciones
- Navegación entre páginas
- Navegación por teclado

### Animaciones

- Animaciones al hacer scroll (AOS)
- Transiciones suaves
- Efectos hover
- Animaciones personalizadas

## 🎨 Personalización

### Colores

Los colores principales se definen en `assets/css/styles.css`:

```css
.hero-gradient {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
}
```

### Tipografías

- **Cuerpo**: Montserrat (Google Fonts)
- **Títulos**: Playfair Display (Google Fonts)

## 📊 SEO y Analytics

### Meta Tags Incluidos

- Open Graph para Facebook
- Twitter Cards
- Meta descripción y keywords
- Google Analytics (configurar ID)

### Próximas Implementaciones

- Schema markup para SEO local
- Google Analytics completo
- Mapa del sitio XML

## 🔧 Módulos JavaScript

### AnimationsManager

Gestiona todas las animaciones AOS y animaciones personalizadas.

```javascript
import { animationsManager } from "./modules/animations.js";
animationsManager.init();
```

### IconsManager

Maneja la inicialización y gestión de íconos Feather.

```javascript
import { iconsManager } from "./modules/icons.js";
iconsManager.init();
```

### FormValidator

Valida formularios con reglas personalizables.

```javascript
import { formValidator } from "./modules/form-validation.js";
formValidator.init();
```

## 📝 Convenciones de Código

- **JavaScript**: ES6+ con módulos
- **CSS**: Tailwind utilities + custom classes
- **HTML**: Semántico con accessibility
- **Nombres**: camelCase para JS, kebab-case para CSS

## 🚀 Despliegue

### Despliegue en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel:

1. **Conecta tu repositorio de Git** a Vercel
2. **Configuración automática**: Vercel detectará automáticamente la configuración
3. **Deploy automático**: Cada push al repositorio principal activará un nuevo deploy

**Archivos de configuración incluidos:**

- `vercel.json`: Configura el directorio `public/` como directorio de salida
- `public/_redirects`: Maneja las redirecciones de rutas
- `public/.nojekyll`: Evita procesamiento de Jekyll

### Otras Opciones de Despliegue

1. **Netlify**: Arrastrar y soltar el directorio completo
2. **GitHub Pages**: Configurar GitHub Actions para el deploy
3. **Servidor tradicional**: FTP al directorio público del servidor

### Optimizaciones para Producción

- [x] Estructura modular de archivos
- [x] Archivos optimizados y minificados
- [x] Configuración de cache incluida
- [ ] Compresión GZIP adicional
- [ ] CDN para assets estáticos
- [ ] Service Worker para cache offline

## 📞 Contacto

**PolisConsult**

- Email: info@polisconsult.com
- Teléfono: +54 11 1234-5678
- Web: https://polisconsult.com

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

---

Desarrollado con ❤️ por el equipo de PolisConsult
