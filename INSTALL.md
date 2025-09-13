# 🚀 Guía de Instalación - PolisConsult Website

## Requisitos Previos

- **Node.js** 14.0.0 o superior
- **Navegador moderno** con soporte ES6+ y módulos

## Instalación Rápida

```bash
# 1. Clonar o descargar el proyecto
# 2. Instalar dependencias (opcional, solo para servidor alternativo)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

## Acceder al Sitio

Una vez ejecutado el comando anterior, abre tu navegador y ve a:
**http://localhost:3000**

## Comandos Disponibles

```bash
# Servidor de desarrollo personalizado
npm run dev

# Servidor alternativo (requiere instalación)
npm run serve

# Ver otros comandos disponibles
npm run
```

## Estructura del Proyecto

```
polisconsult-website/
├── index.html              # Página principal
├── assets/
│   ├── css/styles.css      # Estilos personalizados
│   ├── js/
│   │   ├── main.js         # Punto de entrada JavaScript
│   │   └── modules/        # Módulos JavaScript
│   └── images/             # Imágenes (futuro)
├── server.js               # Servidor de desarrollo
├── package.json            # Configuración del proyecto
└── README.md               # Documentación completa
```

## Características Implementadas

✅ **Diseño Responsivo** - Optimizado para móviles y desktop
✅ **Animaciones Suaves** - AOS para efectos de scroll
✅ **Validación de Formularios** - JavaScript modular
✅ **SEO Optimizado** - Meta tags completos
✅ **Arquitectura Modular** - JavaScript organizado en módulos
✅ **Google Analytics** - Listo para configuración

## Próximos Pasos

1. **Configurar Google Analytics**: Reemplaza `GA_MEASUREMENT_ID` en `index.html`
2. **Agregar imágenes**: Coloca las imágenes en `assets/images/`
3. **Personalizar contenido**: Actualiza textos y datos del equipo
4. **Desplegar**: Sube a Netlify, Vercel, o tu hosting preferido

## Soporte

Si encuentras problemas, verifica:

- Que Node.js esté instalado: `node --version`
- Que el puerto 3000 esté disponible
- Que no haya procesos usando el puerto

---

¡Tu sitio web profesional de PolisConsult está listo! 🎉
