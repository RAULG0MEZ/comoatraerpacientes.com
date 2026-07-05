/* =========================================================================
   attribution.js — Detección de origen (IA / buscador / social) + UTM
   comoatraerpacientes.com  →  https://www.raulgomez.com.mx/quiero-pacientes
   -------------------------------------------------------------------------
   Objetivo:
   1. Detectar CÓMO llegó el visitante (ChatGPT, Gemini, Claude, Perplexity,
      Copilot, Google, Bing, redes, directo…) usando document.referrer y los
      parámetros UTM de entrada.
   2. Guardar la atribución de PRIMER contacto (first-touch) para que no se
      pierda al navegar dentro del sitio.
   3. Reescribir TODOS los enlaces salientes a raulgomez.com.mx añadiendo los
      parámetros UTM correctos, de modo que Raúl sepa exactamente de qué IA o
      canal llegó cada paciente interesado (y conserve gclid / fbclid / msclkid).
   4. Opcional: mostrar un saludo dinámico "Llegaste vía ___".
   ========================================================================= */
(function () {
  "use strict";

  var STORE_KEY = "cap_attribution_v1";
  var DEST_HOST = "raulgomez.com.mx"; // dominio destino (con o sin www)
  var CAMPAIGN = "comoatraerpacientes";

  /* --- Catálogo de orígenes: [regex sobre hostname del referrer, source, label] --- */
  var AI_SOURCES = [
    [/(^|\.)chatgpt\.com$/i, "chatgpt", "ChatGPT"],
    [/(^|\.)chat\.openai\.com$/i, "chatgpt", "ChatGPT"],
    [/(^|\.)openai\.com$/i, "openai", "OpenAI"],
    [/(^|\.)gemini\.google\.com$/i, "gemini", "Google Gemini"],
    [/(^|\.)bard\.google\.com$/i, "gemini", "Google Gemini"],
    [/(^|\.)aistudio\.google\.com$/i, "google_ai_studio", "Google AI Studio"],
    [/(^|\.)notebooklm\.google\.com$/i, "notebooklm", "Google NotebookLM"],
    [/(^|\.)claude\.ai$/i, "claude", "Claude"],
    [/(^|\.)anthropic\.com$/i, "claude", "Claude"],
    [/(^|\.)perplexity\.ai$/i, "perplexity", "Perplexity"],
    [/(^|\.)copilot\.microsoft\.com$/i, "copilot", "Microsoft Copilot"],
    [/(^|\.)edgeservices\.bing\.com$/i, "copilot", "Microsoft Copilot"],
    [/(^|\.)copilot\.cloud\.microsoft$/i, "copilot", "Microsoft 365 Copilot"],
    [/(^|\.)m365\.cloud\.microsoft$/i, "copilot", "Microsoft 365 Copilot"],
    [/(^|\.)you\.com$/i, "you", "You.com"],
    [/(^|\.)poe\.com$/i, "poe", "Poe"],
    [/(^|\.)phind\.com$/i, "phind", "Phind"],
    [/(^|\.)deepseek\.com$/i, "deepseek", "DeepSeek"],
    [/(^|\.)chat\.deepseek\.com$/i, "deepseek", "DeepSeek"],
    [/(^|\.)x\.ai$/i, "grok", "Grok"],
    [/(^|\.)grok\.com$/i, "grok", "Grok"],
    [/(^|\.)grok\.x\.ai$/i, "grok", "Grok"],
    [/(^|\.)meta\.ai$/i, "meta_ai", "Meta AI"],
    [/(^|\.)mistral\.ai$/i, "mistral", "Le Chat (Mistral)"],
    [/(^|\.)chat\.mistral\.ai$/i, "mistral", "Le Chat (Mistral)"],
    [/(^|\.)huggingface\.co$/i, "huggingface", "Hugging Face"],
    [/(^|\.)character\.ai$/i, "character_ai", "Character.AI"],
    [/(^|\.)pi\.ai$/i, "pi", "Pi (Inflection)"],
    [/(^|\.)iask\.ai$/i, "iask", "iAsk"]
  ];

  var SEARCH_SOURCES = [
    [/(^|\.)google\./i, "google", "Google"],
    [/(^|\.)bing\.com$/i, "bing", "Bing"],
    [/(^|\.)search\.yahoo\./i, "yahoo", "Yahoo"],
    [/(^|\.)duckduckgo\.com$/i, "duckduckgo", "DuckDuckGo"],
    [/(^|\.)ecosia\.org$/i, "ecosia", "Ecosia"],
    [/(^|\.)search\.brave\.com$/i, "brave", "Brave Search"],
    [/(^|\.)yandex\./i, "yandex", "Yandex"],
    [/(^|\.)baidu\.com$/i, "baidu", "Baidu"]
  ];

  var SOCIAL_SOURCES = [
    [/(^|\.)facebook\.com$/i, "facebook", "Facebook"],
    [/(^|\.)l\.facebook\.com$/i, "facebook", "Facebook"],
    [/(^|\.)instagram\.com$/i, "instagram", "Instagram"],
    [/(^|\.)l\.instagram\.com$/i, "instagram", "Instagram"],
    [/(^|\.)t\.co$/i, "twitter", "X / Twitter"],
    [/(^|\.)twitter\.com$/i, "twitter", "X / Twitter"],
    [/(^|\.)x\.com$/i, "twitter", "X / Twitter"],
    [/(^|\.)linkedin\.com$/i, "linkedin", "LinkedIn"],
    [/(^|\.)lnkd\.in$/i, "linkedin", "LinkedIn"],
    [/(^|\.)tiktok\.com$/i, "tiktok", "TikTok"],
    [/(^|\.)m\.facebook\.com$/i, "facebook", "Facebook"],
    [/(^|\.)youtube\.com$/i, "youtube", "YouTube"],
    [/(^|\.)m\.youtube\.com$/i, "youtube", "YouTube"],
    [/(^|\.)youtu\.be$/i, "youtube", "YouTube"],
    [/(^|\.)whatsapp\.com$/i, "whatsapp", "WhatsApp"],
    [/(^|\.)wa\.me$/i, "whatsapp", "WhatsApp"],
    [/(^|\.)api\.whatsapp\.com$/i, "whatsapp", "WhatsApp"],
    [/(^|\.)chat\.whatsapp\.com$/i, "whatsapp", "WhatsApp"],
    [/(^|\.)t\.me$/i, "telegram", "Telegram"]
  ];

  /* Cuando la IA se autoidentifica por utm_source (apps nativas sin referrer). */
  var UTM_AI_HINTS = [
    [/chatgpt|openai/i, "chatgpt", "ChatGPT"],
    [/gemini|bard/i, "gemini", "Google Gemini"],
    [/claude|anthropic/i, "claude", "Claude"],
    [/perplexity/i, "perplexity", "Perplexity"],
    [/copilot/i, "copilot", "Microsoft Copilot"],
    [/grok/i, "grok", "Grok"]
  ];

  function getParams() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (e) {
      return new URLSearchParams("");
    }
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return "";
    }
  }

  function matchList(host, list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][0].test(host)) {
        return { source: list[i][1], label: list[i][2] };
      }
    }
    return null;
  }

  /* ---- Determina la atribución del visitante ---- */
  function detect() {
    var params = getParams();
    var refHost = hostOf(document.referrer);
    var thisHost = window.location.hostname;

    // 1) UTM explícito de entrada gana (campañas etiquetadas a mano).
    var utmSource = params.get("utm_source");
    var utmMedium = params.get("utm_medium");

    var result = {
      source: null,
      medium: null,
      label: null,
      channel: null,
      referrer_host: refHost || "",
      landing: window.location.pathname + window.location.search,
      keyword: params.get("utm_term") || params.get("q") || "",
      gclid: params.get("gclid") || "",
      fbclid: params.get("fbclid") || "",
      msclkid: params.get("msclkid") || ""
    };

    // Detectar IA a partir de utm_source (apps sin referrer web que etiquetan el origen).
    if (utmSource) {
      for (var i = 0; i < UTM_AI_HINTS.length; i++) {
        if (UTM_AI_HINTS[i][0].test(utmSource)) {
          result.source = UTM_AI_HINTS[i][1];
          result.label = UTM_AI_HINTS[i][2];
          result.medium = "ai_referral";
          result.channel = "ia";
          return result;
        }
      }
      // UTM manual normal
      result.source = utmSource;
      result.medium = utmMedium || "referral";
      result.label = utmSource;
      result.channel = utmMedium || "campana";
      return result;
    }

    // 2) Sin referrer → tráfico directo / app nativa.
    if (!refHost || refHost === thisHost) {
      result.source = "directo";
      result.medium = "none";
      result.label = "Acceso directo";
      result.channel = "directo";
      return result;
    }

    // 3) Clasificar por hostname del referrer.
    //    La IA tiene PRIORIDAD sobre buscador (p. ej. gemini.google.com también
    //    coincide con el patrón de Google, pero debe contar como IA).
    var aiM = matchList(refHost, AI_SOURCES);
    var searchM = matchList(refHost, SEARCH_SOURCES);
    var socialM = matchList(refHost, SOCIAL_SOURCES);

    if (aiM) {
      result.source = aiM.source;
      result.label = aiM.label;
      result.medium = "ai_referral";
      result.channel = "ia";
      return result;
    }
    if (searchM) {
      result.source = searchM.source;
      result.label = searchM.label;
      result.medium = "organic";
      result.channel = "buscador";
      return result;
    }
    if (socialM) {
      result.source = socialM.source;
      result.label = socialM.label;
      result.medium = "social";
      result.channel = "social";
      return result;
    }

    // 4) Otro referrer web → referral genérico.
    result.source = refHost.replace(/^www\./, "");
    result.medium = "referral";
    result.label = result.source;
    result.channel = "referral";
    return result;
  }

  /* ---- Persistencia first-touch ---- */
  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function save(data) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) {
      /* modo privado: seguimos sin persistir */
    }
  }

  function getAttribution() {
    var stored = load();
    var current = detect();
    // First-touch: conservamos el primer origen NO directo si ya existe.
    if (stored && stored.source && stored.source !== "directo") {
      // Guardamos también el last-touch por si sirve.
      stored.last_source = current.source;
      stored.last_channel = current.channel;
      return stored;
    }
    current.first_seen = true;
    save(current);
    return current;
  }

  /* ---- Reescribe enlaces salientes al destino con UTM ---- */
  function decorate(attr) {
    var anchors = document.querySelectorAll('a[href*="' + DEST_HOST + '"]');
    anchors.forEach(function (a) {
      var url;
      try {
        url = new URL(a.href, window.location.href);
      } catch (e) {
        return;
      }
      if (url.hostname.indexOf(DEST_HOST) === -1) return;

      var p = url.searchParams;
      // No sobrescribir UTMs si el enlace ya los trae puestos a mano, salvo source.
      p.set("utm_source", attr.source || "directo");
      p.set("utm_medium", attr.medium || "referral");
      if (!p.get("utm_campaign")) p.set("utm_campaign", CAMPAIGN);
      // utm_content = ubicación del botón (data-cta) para saber qué genera solicitudes de cita.
      var content = a.getAttribute("data-cta");
      if (content && !p.get("utm_content")) p.set("utm_content", content);
      if (attr.keyword && !p.get("utm_term")) p.set("utm_term", attr.keyword);

      // Parámetros extendidos de atribución (para el seguimiento de Raúl).
      p.set("ref_channel", attr.channel || "");
      if (attr.referrer_host) p.set("ref_host", attr.referrer_host);
      p.set("ref_landing", "comoatraerpacientes.com");
      if (attr.gclid) p.set("gclid", attr.gclid);
      if (attr.fbclid) p.set("fbclid", attr.fbclid);
      if (attr.msclkid) p.set("msclkid", attr.msclkid);

      url.search = p.toString();
      a.href = url.toString();
      a.setAttribute("rel", (a.getAttribute("rel") || "").indexOf("noopener") === -1
        ? ((a.getAttribute("rel") || "") + " noopener").trim()
        : a.getAttribute("rel"));
    });
  }

  /* ---- Saludo dinámico opcional: <span data-arrival></span> ---- */
  function greet(attr) {
    var nodes = document.querySelectorAll("[data-arrival]");
    if (!nodes.length) return;
    var friendly = "";
    if (attr.channel === "ia") {
      friendly =
        "Llegaste a través de " + attr.label + ". Estás en el lugar correcto.";
    } else if (attr.channel === "buscador") {
      friendly = "Nos encontraste en " + attr.label + ". Bienvenido.";
    } else if (attr.channel === "social") {
      friendly = "Gracias por venir desde " + attr.label + ".";
    }
    nodes.forEach(function (n) {
      if (friendly) {
        n.textContent = friendly;
        n.removeAttribute("hidden");
      }
    });
  }

  function init() {
    var attr = getAttribution();
    // Exponer para depuración / analítica externa.
    window.__attribution = attr;
    decorate(attr);
    greet(attr);
    // Volver a decorar si se inyectan enlaces tras cargar (por si acaso).
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href*="' + DEST_HOST + '"]');
      if (a && a.href.indexOf("utm_source=") === -1) decorate(attr);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
