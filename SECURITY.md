# 🔐 Guía de Seguridad - PolisConsult Website

## API Keys y Configuración Sensible

### EmailJS Security

**¿Son seguras las claves públicas de EmailJS?**

#### ✅ **Claves Públicas (Public Keys)**

- **Diseño intencional**: EmailJS está diseñado para usar claves públicas en el frontend
- **Sin riesgo de seguridad**: Estas claves están pensadas para ser públicas
- **Límites de protección**: EmailJS tiene límites de uso y medidas anti-abuso

#### ⚠️ **Riesgos Reales**

- **Consumo de cuota**: Si alguien usa tus claves, consume tu cuota mensual (200 emails gratis)
- **Bloqueo de cuenta**: Uso excesivo puede llevar a suspensión temporal
- **Spam**: Posible abuso por parte de terceros

// ❌ MAL: Archivo con claves en repositorio público
// config.js subido a Git
```

#### ✅ **Mejores Prácticas**

1. **Archivo separado para claves**:

   ```javascript
   // public/assets/js/config.js (NO subir a Git)
   export const EMAILJS_CONFIG = {
     SERVICE_ID: "tu_service_id_real",
     TEMPLATE_ID: "tu_template_id_real",
     PUBLIC_KEY: "tu_public_key_real",
   };
   ```

2. **.gitignore configurado**:

   ```
   # Ya incluido en .gitignore
   public/assets/js/config.js
   **/config.js
   **/*config*.js
   ```

3. **Validación de configuración**:
   ```javascript
   // El código valida que las claves estén configuradas
   if (SERVICE_ID === "tu_service_id_real_aqui") {
     throw new Error("EmailJS no configurado");
   }
   ```

## Medidas de Seguridad Implementadas

### 🛡️ **Protecciones Incluidas**

1. **Validación de configuración**: El código verifica que las claves estén configuradas
2. **Archivo .gitignore**: Previene subida accidental de claves
3. **Separación de concerns**: Claves separadas del código funcional
4. **Mensajes de error**: Guían al usuario si EmailJS no está configurado

### 🔍 **Cómo Verificar Seguridad**

```bash
# Verificar que config.js no esté en Git
git status
git ls-files | grep config.js

# Si aparece, removerlo inmediatamente
git rm --cached public/assets/js/config.js
```

## Configuración Segura

### Paso 1: Crear cuenta EmailJS

1. Ve a [EmailJS.com](https://www.emailjs.com/)
2. Regístrate con cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar servicio de email

1. En Dashboard → "Email Services"
2. Selecciona tu proveedor (Gmail/Outlook)
3. Concede permisos a EmailJS
4. El Service ID se genera automáticamente

### Paso 3: Crear template

1. Ve a "Email Templates"
2. Crea nuevo template con variables disponibles
3. Prueba el template

### Paso 4: Configurar localmente

```javascript
// Crea: public/assets/js/config.js
export const EMAILJS_CONFIG = {
  SERVICE_ID: "service_xxxxxxxxx", // ← Copia del dashboard
  TEMPLATE_ID: "template_xxxxxxxx", // ← Copia del dashboard
  PUBLIC_KEY: "xxxxxxxxxxxxxxxx", // ← Copia del dashboard
};
```

### Paso 5: Verificar configuración

1. Abre el sitio localmente
2. Completa el formulario
3. Verifica que llegue el email
4. Revisa la consola por errores

## Respuesta a Incidentes

### Si se exponen las claves:

1. **Cambiar claves inmediatamente**:

   - Ve a EmailJS Dashboard
   - Genera nuevas claves
   - Actualiza config.js

2. **Monitorear uso**:

   - Revisa estadísticas en EmailJS
   - Configura alertas de uso

3. **Limpiar repositorio**:
   ```bash
   # Si se subió accidentalmente
   git rm --cached public/assets/js/config.js
   git commit -m "Remove sensitive config file"
   ```

## Recomendaciones Generales

### 🔒 **Seguridad Web**

- Mantén EmailJS actualizado
- Usa HTTPS en producción
- Configura límites de rate limiting
- Monitorea logs de envío

### 📊 **Monitoreo**

- Revisa dashboard de EmailJS regularmente
- Configura alertas de uso excesivo
- Mantén backup de configuraciones

### 🚨 **Contactos de Emergencia**

- EmailJS Support: support@emailjs.com
- Tu proveedor de hosting para soporte adicional

---

## ✅ Checklist de Seguridad

- [ ] EmailJS configurado correctamente
- [ ] Archivo config.js creado localmente
- [ ] config.js excluido de Git (.gitignore)
- [ ] Claves probadas en entorno local
- [ ] Template de email personalizado
- [ ] Monitoreo de uso configurado

**Recuerda**: La seguridad es un proceso continuo, no un evento único. 🔐
