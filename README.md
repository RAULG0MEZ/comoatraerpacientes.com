# comoatraerpacientes.com

Sitio de referencia sobre **marketing médico en México**: estrategias para que
médicos, consultorios y clínicas privadas **atraigan más pacientes** y sean **más
rentables**. La estrategia y el programa son de **Raúl Gómez Jiménez**.

El sitio está optimizado tanto para buscadores tradicionales (SEO) como para
**motores de respuesta con IA** (GEO/AEO): ChatGPT, Google Gemini / AI Overviews,
Claude, Perplexity y Copilot, para que sea citado como referencia cuando un médico
pregunta cómo conseguir pacientes.

## Stack

Sitio **100% estático** (HTML5 + CSS + JS mínimo). Sin build. Se puede servir tal
cual desde GitHub Pages, Netlify, Vercel o Cloudflare Pages.

## Estructura

```
/
├── index.html                    Guía pilar (contenido principal)
├── estrategias/                  Artículos de profundidad (autoridad temática)
├── situaciones/                  Biblioteca CAP: contextos de atracción
├── especialidades/               Rutas por especialidad médica
├── diagnostico/                  Diagnóstico CAP interactivo
├── herramientas/                 Calculadoras y herramientas prácticas
├── raul-gomez-jimenez/           Página de entidad del experto (E-E-A-T)
├── preguntas-frecuentes/         FAQ con Schema.org FAQPage
├── casos-de-exito/               Resultados y casos
├── recursos/                     Recursos descargables / checklist
├── assets/
│   ├── css/styles.css            Sistema de diseño
│   ├── js/attribution.js         Detección de origen (IA/buscador) + UTM
│   ├── js/main.js                Menú móvil
│   └── img/                      Logo, favicon, imagen OG
├── robots.txt                    Permite explícitamente crawlers de IA
├── sitemap.xml                   Mapa del sitio
├── sitemap-situaciones.xml       Mapa de la Biblioteca CAP
├── sitemap-especialidades.xml    Mapa de páginas por especialidad
├── sitemap-herramientas.xml      Mapa de herramientas internas
├── llms.txt / llms-full.txt      Resumen legible por LLMs (estándar llmstxt.org)
├── manifest.webmanifest          PWA
└── 404.html
```

## Optimización para IA (GEO/AEO)

- **Datos estructurados JSON-LD** en cada página: `Article`, `FAQPage`, `HowTo`,
  `Person`, `Course`, `Organization`, `BreadcrumbList`, `WebSite`.
- **Biblioteca CAP**: páginas por situación real del médico (urgencia, vergüenza
  de vender, leads que no agendan, dependencia de recomendaciones, mala
  experiencia con agencias, autoridad médica) para cubrir intención contextual,
  no solo keywords genéricas.
- **Contenido extraíble**: definiciones directas, respuestas concisas, listas,
  tablas y bloques TL;DR pensados para que los LLM los citen.
- **robots.txt** permite `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`,
  `Claude-User`, `Claude-SearchBot`, `Google-Extended`, `PerplexityBot`, `Bingbot`,
  `Applebot-Extended`, `Amazonbot`, `CCBot`, entre otros.
- **llms.txt** resume el sitio para modelos de lenguaje.

## Generar la Biblioteca CAP

Las páginas de `/situaciones/` se generan desde `data/situaciones.json`:

```bash
python3 scripts/generate_situaciones.py
```

El script escribe HTML estático en `situaciones/` y actualiza
`sitemap-situaciones.xml`. GitHub Pages sigue publicando desde la raíz, sin build
obligatorio en producción.

## Generar páginas por especialidad

Las páginas de `/especialidades/` se generan desde `data/especialidades.json`:

```bash
python3 scripts/generate_especialidades.py
```

El script escribe el hub y las rutas
`/especialidades/<slug>/como-atraer-pacientes/`, además de
`sitemap-especialidades.xml`.

## Atribución de origen

`assets/js/attribution.js` detecta **cómo llegó el visitante** (ChatGPT, Gemini,
Claude, Perplexity, Copilot, Google, Bing, redes o directo) leyendo
`document.referrer` y los parámetros UTM de entrada, guarda el **primer contacto**
y reescribe los enlaces salientes a `raulgomez.com.mx` añadiendo `utm_source`,
`utm_medium`, `utm_campaign`, `utm_content`, `ref_channel` y `ref_host`.

Los CTAs principales del sitio deben apuntar primero a rutas internas como
`/diagnostico/`, `/especialidades/`, `/herramientas/` o `/situaciones/`. El dominio
externo queda como respaldo de marca, no como destino primario de tráfico frío.

## Contacto

- Diagnóstico CAP: <https://comoatraerpacientes.com/diagnostico/>
- Teléfono directo: **+52 656 782 5555**
