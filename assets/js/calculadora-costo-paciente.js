(function () {
  "use strict";

  var form = document.getElementById("calc-paciente-form");
  if (!form) return;

  var currency = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  });

  function number(name) {
    var field = form.elements[name];
    var value = field ? Number(field.value) : 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function divide(total, count) {
    return count > 0 ? total / count : 0;
  }

  function percent(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
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

  function diagnose(values) {
    var solicitudACita = percent(values.citas, values.solicitudes);
    var asistencia = percent(values.asistidas, values.citas);
    var cierre = percent(values.pacientes, values.asistidas);
    var retorno = values.inversion > 0 ? (values.pacientes * values.ingreso) / values.inversion : 0;

    if (!values.solicitudes) {
      return {
        status: "Sin datos",
        text: "Todavía no hay suficientes solicitudes para diagnosticar. Empieza por visibilidad: Perfil de Empresa en Google, reseñas, páginas por servicio y una oferta clara.",
        recommendation: "Registra durante 30 días solicitudes, citas, asistencias y pacientes atendidos antes de decidir si necesitas más presupuesto."
      };
    }
    if (solicitudACita < 20) {
      return {
        status: "Fuga en WhatsApp",
        text: "Tu costo por solicitud puede verse bien, pero la fuga principal parece estar en WhatsApp o recepción: muchos mensajes no se vuelven citas.",
        recommendation: "Revisa velocidad de respuesta, primer mensaje, manejo de precio, confirmación y seguimiento. Aumentar solicitudes sin corregir recepción puede salir caro."
      };
    }
    if (asistencia < 70) {
      return {
        status: "Fuga en asistencia",
        text: "El problema fuerte está en asistencia: sí agendas, pero no llegan. El costo por cita puede parecer aceptable, pero el costo por paciente se dispara.",
        recommendation: "Usa confirmación 24 horas antes, recordatorio el mismo día, ubicación clara, política de reagendado y recuperación rápida de no asistidos."
      };
    }
    if (cierre < 50) {
      return {
        status: "Fuga post-consulta",
        text: "La fuga está después de la cita: llegan, pero no pagan, no compran el plan o no continúan tratamiento.",
        recommendation: "Revisa explicación del diagnóstico, plan de tratamiento, financiamiento, seguimiento post-consulta y claridad de la oferta."
      };
    }
    if (retorno < 1.5) {
      return {
        status: "Retorno apretado",
        text: "El sistema está llevando solicitudes a cita, pero el retorno todavía está apretado.",
        recommendation: "Revisa ingreso promedio por paciente, servicio promocionado, margen real y costo por canal antes de escalar presupuesto."
      };
    }
    return {
      status: "Ruta sana",
      text: "La ruta del paciente se ve sana: hay solicitudes, citas, asistencia y pacientes.",
      recommendation: "Escala con cuidado, separando canales, especialidades y servicios para saber cuál trae pacientes rentables."
    };
  }

  function buildShareText(values, metrics, diagnosis) {
    return [
      "Mi calculadora de costo por paciente",
      "",
      "Inversión: " + currency.format(values.inversion),
      "Solicitudes: " + values.solicitudes,
      "Citas agendadas: " + values.citas,
      "Citas asistidas: " + values.asistidas,
      "Pacientes que pagaron: " + values.pacientes,
      "Ingreso promedio: " + currency.format(values.ingreso),
      "",
      "Costo por solicitud: " + metrics.costoSolicitud,
      "Costo por cita: " + metrics.costoCita,
      "Costo por paciente: " + metrics.costoPaciente,
      "Retorno estimado: " + metrics.retorno,
      "Solicitudes que agendan: " + metrics.solicitudACita,
      "Citas que asisten: " + metrics.asistencia,
      "Asistidas que pagan: " + metrics.cierre,
      "",
      "Lectura: " + diagnosis.status,
      diagnosis.text,
      "Recomendación: " + diagnosis.recommendation
    ].join("\n");
  }

  function calculate() {
    var values = {
      inversion: number("inversion"),
      solicitudes: number("solicitudes"),
      citas: number("citas"),
      asistidas: number("asistidas"),
      pacientes: number("pacientes"),
      ingreso: number("ingreso")
    };

    var costoSolicitud = divide(values.inversion, values.solicitudes);
    var costoCita = divide(values.inversion, values.citas);
    var costoPaciente = divide(values.inversion, values.pacientes);
    var retorno = values.inversion > 0 ? (values.pacientes * values.ingreso) / values.inversion : 0;
    var solicitudACita = percent(values.citas, values.solicitudes);
    var asistencia = percent(values.asistidas, values.citas);
    var cierre = percent(values.pacientes, values.asistidas);
    var diagnosis = diagnose(values);
    var formatted = {
      costoSolicitud: costoSolicitud ? currency.format(costoSolicitud) : "$0",
      costoCita: costoCita ? currency.format(costoCita) : "$0",
      costoPaciente: costoPaciente ? currency.format(costoPaciente) : "$0",
      retorno: retorno ? retorno.toFixed(1) + "x" : "0x",
      solicitudACita: solicitudACita + "%",
      asistencia: asistencia + "%",
      cierre: cierre + "%"
    };

    setText("metric-solicitud", formatted.costoSolicitud);
    setText("metric-cita", formatted.costoCita);
    setText("metric-paciente", formatted.costoPaciente);
    setText("metric-retorno", formatted.retorno);
    setText("metric-solicitud-cita", formatted.solicitudACita);
    setText("metric-asistencia", formatted.asistencia);
    setText("metric-cierre", formatted.cierre);
    setText("metric-estado", diagnosis.status);
    setText("calc-texto", diagnosis.text);
    setText("calc-recomendacion", diagnosis.recommendation);

    var shareText = buildShareText(values, formatted, diagnosis);
    var whatsapp = document.getElementById("calc-whatsapp");
    var email = document.getElementById("calc-email");
    var save = document.getElementById("calc-guardar");
    if (whatsapp) {
      whatsapp.href = "https://wa.me/526567825555?text=" + encodeURIComponent(shareText + "\n\nQuiero revisar estos números.");
    }
    if (email) {
      email.href = "mailto:?subject=" + encodeURIComponent("Mi costo por paciente") + "&body=" + encodeURIComponent(shareText);
    }
    if (save) {
      save.onclick = function () {
        downloadText("costo-por-paciente.txt", shareText);
      };
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    calculate();
  });
  form.addEventListener("input", calculate);
  calculate();
})();
