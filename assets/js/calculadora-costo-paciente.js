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

  function diagnose(values) {
    var leadToCita = percent(values.citas, values.leads);
    var asistencia = percent(values.asistidas, values.citas);
    var cierre = percent(values.pacientes, values.asistidas);
    var retorno = values.inversion > 0 ? (values.pacientes * values.ingreso) / values.inversion : 0;

    if (!values.leads) {
      return "Todavía no hay suficientes leads para diagnosticar. Empieza por visibilidad: Google Business Profile, reseñas, páginas por servicio y una oferta clara.";
    }
    if (leadToCita < 20) {
      return "Tu fuga principal parece estar en WhatsApp o recepción: muchos mensajes no se vuelven citas. Revisa velocidad de respuesta, primer mensaje, manejo de precio y seguimiento.";
    }
    if (asistencia < 70) {
      return "El problema fuerte está en asistencia: sí agendas, pero no llegan. Usa confirmación 24 horas antes, recordatorio el mismo día, ubicación clara y reprogramación rápida.";
    }
    if (cierre < 50) {
      return "La fuga está después de la cita: llegan, pero no compran o no continúan. Revisa propuesta, explicación de tratamiento, financiamiento y seguimiento post-consulta.";
    }
    if (retorno < 1.5) {
      return "El sistema convierte, pero el retorno todavía está apretado. Revisa ingreso promedio por paciente, servicio promocionado y costo por canal antes de escalar.";
    }
    return "El embudo se ve sano: hay leads, citas, asistencia y pacientes. Ahora toca escalar con cuidado, separando canales para saber cuál trae pacientes rentables.";
  }

  function calculate() {
    var values = {
      inversion: number("inversion"),
      leads: number("leads"),
      citas: number("citas"),
      asistidas: number("asistidas"),
      pacientes: number("pacientes"),
      ingreso: number("ingreso")
    };

    var costoLead = divide(values.inversion, values.leads);
    var costoCita = divide(values.inversion, values.citas);
    var costoPaciente = divide(values.inversion, values.pacientes);
    var retorno = values.inversion > 0 ? (values.pacientes * values.ingreso) / values.inversion : 0;

    setText("metric-lead", costoLead ? currency.format(costoLead) : "$0");
    setText("metric-cita", costoCita ? currency.format(costoCita) : "$0");
    setText("metric-paciente", costoPaciente ? currency.format(costoPaciente) : "$0");
    setText("metric-retorno", retorno ? retorno.toFixed(1) + "x" : "0x");
    setText("calc-texto", diagnose(values));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    calculate();
  });
  form.addEventListener("input", calculate);
  calculate();
})();
