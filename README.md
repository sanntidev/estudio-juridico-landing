# ⚖️ Vega & Asociados — Plataforma Web & Embudo de Conversión Legal

Landing page corporativa *mobile-first* diseñada y desarrollada para estudios jurídicos y notarías, enfocada en la generación de autoridad digital, velocidad de carga y conversión directa de consultas legales mediante pre-clasificación inteligente vía WhatsApp.

🔗 **Demo en vivo:** [https://vega-asociados-demo.netlify.app](https://vega-asociados-demo.netlify.app)

---

## 🚀 Características Principales

* **Pre-clasificador Dinámico de Consultas (WhatsApp Funnel):** Módulo interactivo en JavaScript puro que permite al usuario seleccionar el área legal, la modalidad de atención (presencial o virtual) y el profesional asignado, construyendo en tiempo real un mensaje estructurado y sanitizado (`encodeURIComponent`) listo para enviar vía API de WhatsApp (`wa.me`).
* **Diseño Editorial & Responsive (*Mobile-First*):** Arquitectura visual sobria basada en azul marino profundo (`#0F172A`), acentos dorados (`#D4AF37`), tipografía serif/sans-serif de alto contraste y componentes con *glassmorphism* adaptados tanto a escritorio como a dispositivos móviles.
* **Arquitectura Orientada a Conversión:**
  * *Hero Section* con prueba social integrada y llamadas a la acción jerarquizadas.
  * Segmentación clara de áreas de práctica principales y catálogo desplegable de especialidades complementarias.
  * Perfiles ejecutivos de socios con descarga directa de currículum en PDF.
  * Sección de reseñas verificadas e integración de ubicación geográfica.
* **Seguridad y SEO Técnico:** Implementación de cabeceras de seguridad HTTP (`_headers` y `.htaccess`), metadatos Open Graph para previsualización en redes sociales, `robots.txt` y estructura semántica HTML5.

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5 semántico, Tailwind CSS, CSS3 personalizado, Vanilla JavaScript (ES6+).
* **Despliegue & Hosting:** Netlify (CI/CD y certificado SSL/HTTPS).
* **Control de Versiones:** Git & GitHub.

---

## 📁 Estructura del Proyecto

```text
estudio-juridico-landing/
├── assets/             # Recursos gráficos, iconos y documentos de ejemplo
├── css/                # Hojas de estilo personalizadas y ajustes responsive
├── js/                 # Lógica del pre-clasificador de WhatsApp e interacciones UI
├── index.html          # Estructura principal del sitio y metadatos SEO
├── _headers            # Configuración de cabeceras de seguridad para Netlify
├── .htaccess           # Reglas de seguridad y caché para servidores Apache
├── robots.txt          # Directivas de rastreo para motores de búsqueda
└── README.md           # Documentación del proyecto
