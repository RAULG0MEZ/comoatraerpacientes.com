(function () {
  "use strict";

  var form = document.getElementById("diagnostico-form");
  var panel = document.getElementById("diagnostico-resultado");
  if (!form || !panel) return;

  var title = document.getElementById("resultado-titulo");
  var text = document.getElementById("resultado-texto");
  var actions = document.getElementById("resultado-acciones");
  var routeList = document.getElementById("resultado-ruta");
  var link = document.getElementById("resultado-link");
  var summaryPrimary = document.getElementById("resultado-cuello");
  var summarySecondary = document.getElementById("resultado-secundario");
  var summaryPriority = document.getElementById("resultado-prioridad");
  var summaryNext = document.getElementById("resultado-siguiente");
  var whatsapp = document.getElementById("resultado-whatsapp");
  var email = document.getElementById("resultado-email");
  var save = document.getElementById("resultado-guardar");

  var situationRoutes = {
    "agenda-vacia": {
      title: "Tu prioridad es generar conversaciones calificadas rápido",
      href: "/situaciones/necesito-pacientes-este-mes/",
      text: "La agenda floja no se arregla publicando por publicar. Primero activa lo que puede producir citas en corto plazo: pacientes anteriores, referidos, Google, WhatsApp y una campaña pequeña si ya puedes responder rápido.",
      actions: [
        "Reactivar pacientes anteriores con un mensaje útil, no desesperado.",
        "Actualizar el Perfil de Empresa en Google y pedir reseñas recientes.",
        "Medir conversaciones, citas confirmadas y citas asistidas por canal."
      ],
      route: [
        ["Lee", "/situaciones/necesito-pacientes-este-mes/", "Necesito pacientes este mes"],
        ["Usa", "/canales/whatsapp/", "WhatsApp y respuesta rápida"],
        ["Mide", "/herramientas/calculadora-costo-paciente/", "Costo por paciente"]
      ]
    },
    "mensajes-no-agendan": {
      title: "Tu cuello de botella está entre el mensaje y la cita",
      href: "/situaciones/me-escriben-pero-no-agendan/",
      text: "Aumentar publicidad sin corregir recepción puede elevar el costo sin generar más citas asistidas. Revisa velocidad de respuesta, primer mensaje, objeción de precio, confirmación y seguimiento.",
      actions: [
        "Responder en minutos con una ruta clara a cita.",
        "Separar solicitudes nuevas, por responder, agendados y no asistidos.",
        "Comparar fuentes por citas asistidas, no por mensajes bonitos."
      ],
      route: [
        ["Lee", "/situaciones/me-escriben-pero-no-agendan/", "Me escriben, pero no agendan"],
        ["Usa", "/estrategias/whatsapp-business-consultorio/", "Guía de WhatsApp Business"],
        ["Calcula", "/herramientas/calculadora-costo-paciente/", "Costo por cita asistida"]
      ]
    },
    precio: {
      title: "Tu problema principal es percepción de valor",
      href: "/situaciones/solo-me-llegan-pacientes-que-piden-descuento/",
      text: "Si todos preguntan precio y desaparecen, el paciente todavía no entiende por qué elegirte. Hay que ajustar oferta, prueba de confianza y respuesta de WhatsApp.",
      actions: [
        "Explicar qué incluye la consulta o valoración antes de defender precio.",
        "Filtrar motivo, urgencia y expectativa del paciente.",
        "Crear contenido que muestre criterios de decisión, no solo promociones."
      ],
      route: [
        ["Lee", "/situaciones/solo-me-llegan-pacientes-que-piden-descuento/", "Pacientes que piden descuento"],
        ["Ajusta", "/estrategias/oferta-posicionamiento-medico/", "Oferta y posicionamiento"],
        ["Refuerza", "/estrategias/resenas-y-reputacion-online/", "Reseñas y confianza"]
      ]
    },
    verguenza: {
      title: "Tu ruta empieza por comunicación ética",
      href: "/situaciones/soy-buen-medico-pero-no-se-venderme/",
      text: "No necesitas volverte vendedor agresivo. Necesitas traducir tu experiencia en mensajes simples, útiles y profesionales para que el paciente entienda qué haces y cómo agendar.",
      actions: [
        "Escribir una frase clara: a quién ayudas, con qué problema y cómo empieza el proceso.",
        "Crear guiones para precio, valoración y seguimiento.",
        "Pedir reseñas que refuercen confianza, trato y claridad."
      ],
      route: [
        ["Lee", "/situaciones/soy-buen-medico-pero-no-se-venderme/", "Soy buen médico, pero no sé venderme"],
        ["Sigue", "/situaciones/me-da-verguenza-vender-tratamientos/", "Comunicación médica ética"],
        ["Ordena", "/estrategias/marca-personal-medico/", "Marca personal médica"]
      ]
    },
    agencia: {
      title: "Antes de invertir otra vez, audita la ruta del paciente",
      href: "/situaciones/pague-publicidad-y-no-llegaron-pacientes/",
      text: "No basta con cambiar de proveedor. Hay que revisar anuncio, página de servicio, WhatsApp, seguimiento, métricas y pacientes reales. Si no, el mismo problema se repite con otro responsable.",
      actions: [
        "Recolectar reportes, anuncios, conversaciones y citas de la campaña anterior.",
        "Separar métricas superficiales de pacientes reales.",
        "Hacer una prueba pequeña con medición completa antes de escalar."
      ],
      route: [
        ["Lee", "/situaciones/pague-publicidad-y-no-llegaron-pacientes/", "Pagué publicidad y no llegaron pacientes"],
        ["Audita", "/estrategias/publicidad-google-meta-ads-medicos/", "Publicidad médica responsable"],
        ["Calcula", "/herramientas/calculadora-costo-paciente/", "Costo por paciente"]
      ]
    },
    autoridad: {
      title: "Tu siguiente palanca es autoridad visible",
      href: "/situaciones/como-construir-autoridad-medica-online/",
      text: "Si quieres ser elegido con más facilidad, construye activos que expliquen tu criterio: páginas, respuestas, casos, reseñas y contenido que el paciente pueda entender.",
      actions: [
        "Convertir tus dudas frecuentes en contenido claro.",
        "Publicar páginas por servicio, especialidad o padecimiento.",
        "Conectar cada pieza con un siguiente paso para agendar."
      ],
      route: [
        ["Lee", "/situaciones/como-construir-autoridad-medica-online/", "Autoridad médica online"],
        ["Publica", "/estrategias/seo-medico-contenido/", "SEO médico y contenido educativo"],
        ["Conecta", "/estrategias/sitio-web-medico-que-convierte/", "Página médica para agendar consulta"]
      ]
    }
  };

  var specialtyRoutes = {
    dentistas: "/especialidades/dentistas/como-atraer-pacientes/",
    dermatologos: "/especialidades/dermatologos/como-atraer-pacientes/",
    psicologos: "/especialidades/psicologos/como-atraer-pacientes/",
    ginecologos: "/especialidades/ginecologos/como-atraer-pacientes/",
    nutriologos: "/especialidades/nutriologos/como-atraer-pacientes/",
    fisioterapeutas: "/especialidades/fisioterapeutas/como-atraer-pacientes/",
    "medicos-esteticos": "/especialidades/medicos-esteticos/como-atraer-pacientes/"
  };

  var bottleneckAdvice = {
    visibilidad: {
      label: "Visibilidad",
      text: "Como además marcaste visibilidad, revisa Google, reseñas, páginas por servicio y SEO local antes de meter más pauta."
    },
    confianza: {
      label: "Confianza",
      text: "Como además marcaste confianza, fortalece reseñas, prueba social, autoría, fotos reales y una explicación clara del proceso."
    },
    oferta: {
      label: "Oferta médica",
      text: "Como además marcaste oferta, trabaja propuesta de valor, respuesta de precio y filtros para no atraer puro curioso."
    },
    whatsapp: {
      label: "WhatsApp/recepción",
      text: "Como además marcaste WhatsApp, mide tiempo de respuesta, guiones, confirmación y seguimiento. Ahí suele perderse presupuesto de captación."
    },
    seguimiento: {
      label: "Seguimiento",
      text: "Como además marcaste seguimiento, ordena etiquetas, recordatorios y recontacto. Una solicitud olvidada es una cita regalada al competidor."
    }
  };

  function value(name) {
    return form.elements[name] ? form.elements[name].value : "";
  }

  function renderActions(items) {
    actions.innerHTML = "";
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      actions.appendChild(li);
    });
  }

  function renderRoute(items) {
    if (!routeList) return;
    routeList.innerHTML = "";
    items.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item[1];
      a.textContent = item[0] + ": " + item[2];
      li.appendChild(a);
      routeList.appendChild(li);
    });
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function buildShareText(route, secondary, budgetText, urgencyText) {
    var lines = [
      "Mi Diagnóstico CAP",
      "",
      "Cuello principal: " + route.title,
      "Problema secundario: " + secondary.label,
      "Lectura: " + route.text + " " + secondary.text + budgetText + urgencyText,
      "",
      "Ruta recomendada:"
    ];
    (route.route || []).forEach(function (item, index) {
      lines.push((index + 1) + ". " + item[0] + ": " + item[2] + " - " + window.location.origin + item[1]);
    });
    lines.push("", "Acciones inmediatas:");
    route.actions.forEach(function (item) {
      lines.push("- " + item);
    });
    return lines.join("\n");
  }

  function downloadText(filename, content) {
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var route = situationRoutes[value("situacion")] || situationRoutes["agenda-vacia"];
    var specialtyHref = specialtyRoutes[value("especialidad")];
    var budget = value("presupuesto");
    var urgency = value("urgencia");
    var secondary = bottleneckAdvice[value("cuello")] || bottleneckAdvice.visibilidad;

    var budgetText = "";
    if (budget === "0") {
      budgetText = " Con $0 MXN, la jugada inicial es orgánica: Google, reseñas, referidos, reactivación y WhatsApp.";
    } else if (budget === "3000") {
      budgetText = " Con $3,000 MXN, haz una prueba chica y mide citas, no interacciones superficiales.";
    } else if (budget === "10000") {
      budgetText = " Con $10,000 MXN, ya puedes probar campañas con página de servicio o WhatsApp bien medido.";
    } else {
      budgetText = " Con $30,000+ MXN, la prioridad es escalar con ruta completa del paciente y costo por paciente real.";
    }

    var urgencyText = urgency === "este-mes"
      ? " Por la urgencia, no dependas solo de contenido de largo plazo."
      : " Como no todo depende de urgencia inmediata, combina activos de confianza con medición semanal.";

    var resultText = route.text + " " + secondary.text + budgetText + urgencyText;
    var nextStep = specialtyHref ? "Ruta por especialidad" : "Guía de situación";

    title.textContent = route.title;
    text.textContent = resultText;
    setText(summaryPrimary, route.title.replace("Tu ", ""));
    setText(summarySecondary, secondary.label);
    setText(summaryPriority, urgency === "este-mes" ? "Esta semana" : "90 días");
    setText(summaryNext, nextStep);
    renderRoute(route.route || []);
    renderActions(route.actions);
    link.href = specialtyHref || route.href;
    link.textContent = specialtyHref ? "Ver ruta por especialidad" : "Ver guía recomendada";
    var shareText = buildShareText(route, secondary, budgetText, urgencyText);
    if (whatsapp) {
      whatsapp.href = "https://wa.me/526567825555?text=" + encodeURIComponent(shareText + "\n\nQuiero revisar esta ruta.");
    }
    if (email) {
      email.href = "mailto:?subject=" + encodeURIComponent("Mi Diagnóstico CAP") + "&body=" + encodeURIComponent(shareText);
    }
    if (save) {
      save.onclick = function () {
        downloadText("diagnostico-cap.txt", shareText);
      };
    }
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
