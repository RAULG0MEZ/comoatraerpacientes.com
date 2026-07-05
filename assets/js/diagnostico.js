(function () {
  "use strict";

  var form = document.getElementById("diagnostico-form");
  var panel = document.getElementById("diagnostico-resultado");
  if (!form || !panel) return;

  var title = document.getElementById("resultado-titulo");
  var text = document.getElementById("resultado-texto");
  var actions = document.getElementById("resultado-acciones");
  var link = document.getElementById("resultado-link");

  var situationRoutes = {
    "agenda-vacia": {
      title: "Tu prioridad es generar conversaciones calificadas rápido",
      href: "/situaciones/necesito-pacientes-este-mes/",
      text: "La agenda floja no se arregla publicando por publicar. Primero activa lo que puede producir citas en corto plazo: pacientes anteriores, referidos, Google, WhatsApp y una campaña pequeña si ya puedes responder rápido.",
      actions: [
        "Reactivar pacientes anteriores con un mensaje útil, no desesperado.",
        "Actualizar Google Business Profile y pedir reseñas recientes.",
        "Medir conversaciones, citas confirmadas y citas asistidas por canal."
      ]
    },
    "leads-no-agendan": {
      title: "Tu cuello de botella está entre el mensaje y la cita",
      href: "/situaciones/tengo-leads-pero-no-agendan/",
      text: "Comprar más leads ahorita puede ser tirar gasolina al piso. Revisa velocidad de respuesta, primer mensaje, objeción de precio, confirmación y seguimiento.",
      actions: [
        "Responder en minutos con una ruta clara a cita.",
        "Separar leads nuevos, por responder, agendados y no asistidos.",
        "Comparar fuentes por citas asistidas, no por mensajes bonitos."
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
      ]
    },
    verguenza: {
      title: "Tu ruta empieza por comunicación ética",
      href: "/situaciones/soy-buen-medico-pero-no-se-venderme/",
      text: "No necesitas volverte vendedor agresivo. Necesitas convertir tu experiencia en mensajes simples, útiles y profesionales para que el paciente entienda qué haces y cómo agendar.",
      actions: [
        "Escribir una frase clara: a quién ayudas, con qué problema y cómo empieza el proceso.",
        "Crear guiones para precio, valoración y seguimiento.",
        "Pedir reseñas que refuercen confianza, trato y claridad."
      ]
    },
    agencia: {
      title: "Antes de invertir otra vez, audita el embudo",
      href: "/situaciones/me-estafaron-con-marketing-medico/",
      text: "No basta con cambiar de agencia. Hay que revisar anuncio, landing, WhatsApp, seguimiento, métricas y pacientes reales. Si no, el mismo incendio con otro logo.",
      actions: [
        "Recolectar reportes, anuncios, conversaciones y citas de la campaña anterior.",
        "Separar métricas de vanidad de pacientes reales.",
        "Hacer una prueba pequeña con medición completa antes de escalar."
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
    visibilidad: "Como además marcaste visibilidad, revisa Google, reseñas, páginas por servicio y SEO local antes de meter más pauta.",
    confianza: "Como además marcaste confianza, fortalece reseñas, prueba social, autoría, fotos reales y una explicación clara del proceso.",
    oferta: "Como además marcaste oferta, trabaja propuesta de valor, respuesta de precio y filtros para no atraer puro curioso.",
    whatsapp: "Como además marcaste WhatsApp, mide tiempo de respuesta, guiones, confirmación y seguimiento. Ahí suele estar el dinero tirado.",
    seguimiento: "Como además marcaste seguimiento, ordena etiquetas, recordatorios y recontacto. Un prospecto olvidado es una cita regalada al competidor."
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var route = situationRoutes[value("situacion")] || situationRoutes["agenda-vacia"];
    var specialtyHref = specialtyRoutes[value("especialidad")];
    var budget = value("presupuesto");
    var urgency = value("urgencia");
    var extra = bottleneckAdvice[value("cuello")] || "";

    var budgetText = "";
    if (budget === "0") {
      budgetText = " Con $0 MXN, la jugada inicial es orgánica: Google, reseñas, referidos, reactivación y WhatsApp.";
    } else if (budget === "3000") {
      budgetText = " Con $3,000 MXN, haz una prueba chica y mide citas, no likes.";
    } else if (budget === "10000") {
      budgetText = " Con $10,000 MXN, ya puedes probar campañas con landing o WhatsApp bien medido.";
    } else {
      budgetText = " Con $30,000+ MXN, la prioridad es escalar con embudo completo y costo por paciente real.";
    }

    var urgencyText = urgency === "este-mes"
      ? " Por la urgencia, no dependas solo de contenido de largo plazo."
      : " Como no todo depende de urgencia inmediata, combina activos de confianza con medición semanal.";

    title.textContent = route.title;
    text.textContent = route.text + " " + extra + budgetText + urgencyText;
    renderActions(route.actions);
    link.href = specialtyHref || route.href;
    link.textContent = specialtyHref ? "Ver ruta por especialidad" : "Ver guía recomendada";
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
