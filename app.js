import { calculateNetSalary } from './engine/netSalary.js';
import { ssParams, irpfParams, smiParams } from './data.js';

const datosNormativos = { ss: ssParams, irpf: irpfParams };

const state = {
  step: 1,
  data: {
    brutoAnual: 30000,
    numPagas: 14,
    jornada: 'completa',
    horasMensuales: null,
    grupoCotizacion: 1,
    tipoContrato: 'indefinido',
    situacionLaboral: 'activo',
    anoNacimiento: 1990,
    situacionFamiliar: 1,
    conyugeNif: '',
    conyugeRentasAnuales: 0,
    descendientes: [],
    ascendientes: [],
    discapacidadContribuyente: null,
    movilidadReducidaContribuyente: false,
    movilidadGeografica: false,
    ceutaMelilla: false,
    pensionCompensatoria: 0,
    anualidadesPorAlimentos: 0,
    comunidadForal: false,
    viviendaHabitual: { pagosConFinanciacion: false },
    duracionContratoInferiorAno: false,
    relacionLaboralEspecial: false,
    penadoInstitucionPenitenciaria: false
  }
};

const TOTAL_STEPS = 7;
const root = document.getElementById('app');

function fmtEUR(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}
function fmtPct(n) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' %';
}

function render() {
  root.innerHTML = '';
  root.appendChild(renderProgress());
  const stepEl = document.createElement('div');
  stepEl.className = 'step-panel';
  stepEl.appendChild(renderStep());
  root.appendChild(stepEl);
  root.appendChild(renderNav());
}

function renderProgress() {
  const wrap = document.createElement('div');
  wrap.className = 'progress';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === state.step ? ' active' : '') + (i < state.step ? ' done' : '');
    wrap.appendChild(dot);
  }
  return wrap;
}

function stepTitles() {
  return {
    1: 'Salario',
    2: 'Situación laboral',
    3: 'Situación familiar',
    4: 'Hijos y ascendientes',
    5: 'Discapacidad',
    6: 'Situaciones especiales',
    7: 'Resultado'
  };
}

function field(labelText, inputEl) {
  const wrap = document.createElement('label');
  wrap.className = 'field';
  const span = document.createElement('span');
  span.textContent = labelText;
  wrap.appendChild(span);
  wrap.appendChild(inputEl);
  return wrap;
}

function numberInput(value, onChange, opts = {}) {
  const input = document.createElement('input');
  input.type = 'number';
  input.value = value ?? '';
  input.step = opts.step ?? 'any';
  if (opts.min !== undefined) input.min = opts.min;
  input.addEventListener('input', (e) => onChange(e.target.value === '' ? null : Number(e.target.value)));
  return input;
}

function selectInput(value, options, onChange) {
  const select = document.createElement('select');
  for (const [val, label] of options) {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    if (String(val) === String(value)) opt.selected = true;
    select.appendChild(opt);
  }
  select.addEventListener('change', (e) => onChange(e.target.value));
  return select;
}

function checkboxInput(checked, onChange, labelText) {
  const wrap = document.createElement('label');
  wrap.className = 'checkbox';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = !!checked;
  input.addEventListener('change', (e) => onChange(e.target.checked));
  wrap.appendChild(input);
  const span = document.createElement('span');
  span.textContent = labelText;
  wrap.appendChild(span);
  return wrap;
}

function h(tag, text) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  return el;
}

function renderStep() {
  const container = document.createElement('div');
  const titles = stepTitles();
  const eyebrow = h('div', `Paso ${state.step} de ${TOTAL_STEPS}`);
  eyebrow.className = 'eyebrow';
  const title = h('h2', titles[state.step]);
  container.appendChild(eyebrow);
  container.appendChild(title);

  const d = state.data;

  if (state.step === 1) {
    container.appendChild(field('Salario bruto anual (€)', numberInput(d.brutoAnual, v => d.brutoAnual = v, { min: 0 })));
    container.appendChild(field('Número de pagas', selectInput(d.numPagas, [[12, '12 pagas'], [14, '14 pagas']], v => d.numPagas = Number(v))));
    const smiNote = h('p', `Referencia: el SMI 2026 es ${fmtEUR(smiParams.params.smiAnual14Pagas.value)}/año (14 pagas).`);
    smiNote.className = 'hint';
    container.appendChild(smiNote);
  }

  if (state.step === 2) {
    container.appendChild(field('Situación laboral', selectInput(d.situacionLaboral, [
      ['activo', 'Trabajador activo'], ['pensionista', 'Pensionista'], ['desempleado', 'Desempleado']
    ], v => d.situacionLaboral = v)));
    container.appendChild(field('Tipo de contrato', selectInput(d.tipoContrato, [
      ['indefinido', 'Indefinido'], ['temporal', 'Temporal']
    ], v => d.tipoContrato = v)));
    container.appendChild(field('Grupo de cotización', selectInput(d.grupoCotizacion, [
      [1, '1 — Ingenieros, licenciados, dirección'],
      [2, '2 — Ingenieros técnicos, peritos, ayudantes titulados'],
      [3, '3 — Jefes administrativos y de taller'],
      [4, '4 — Ayudantes no titulados'],
      [5, '5 — Oficiales administrativos'],
      [6, '6 — Subalternos'],
      [7, '7 — Auxiliares administrativos'],
      [8, '8 — Oficiales de primera y segunda'],
      [9, '9 — Oficiales de tercera y especialistas'],
      [10, '10 — Peones'],
      [11, '11 — Trabajadores menores de 18 años']
    ], v => d.grupoCotizacion = Number(v))));
    container.appendChild(field('Jornada', selectInput(d.jornada, [
      ['completa', 'Completa'], ['parcial', 'Parcial']
    ], v => { d.jornada = v; render(); })));
    if (d.jornada === 'parcial') {
      container.appendChild(field('Horas trabajadas al mes', numberInput(d.horasMensuales, v => d.horasMensuales = v, { min: 0 })));
    }
    if (d.situacionLaboral === 'activo') {
      container.appendChild(checkboxInput(d.movilidadGeografica, v => d.movilidadGeografica = v, 'Traslado de puesto de trabajo a otro municipio (movilidad geográfica)'));
    }
  }

  if (state.step === 3) {
    container.appendChild(field('Año de nacimiento', numberInput(d.anoNacimiento, v => d.anoNacimiento = v, { min: 1900 })));
    container.appendChild(field('Situación familiar', selectInput(d.situacionFamiliar, [
      [1, 'Situación 1 — general (soltero, o casado y ambos perciben rentas)'],
      [2, 'Situación 2 — casado y el cónyuge no obtiene rentas superiores a 1.500 €/año'],
      [3, 'Situación 3 — otras situaciones']
    ], v => { d.situacionFamiliar = Number(v); render(); })));
    if (Number(d.situacionFamiliar) === 2) {
      container.appendChild(field('Rentas anuales del cónyuge (€)', numberInput(d.conyugeRentasAnuales, v => d.conyugeRentasAnuales = v ?? 0, { min: 0 })));
      const hint = h('p', 'La situación 2 solo procede si el cónyuge no obtiene rentas anuales superiores a 1.500 €.');
      hint.className = 'hint';
      container.appendChild(hint);
      if ((d.conyugeRentasAnuales ?? 0) > 1500) {
        const warn = h('p', 'Con más de 1.500 € de rentas anuales del cónyuge, la situación familiar 2 no es aplicable. Selecciona la situación 1 o 3.');
        warn.className = 'warning';
        container.appendChild(warn);
      }
    }
    container.appendChild(field('Pensión compensatoria al cónyuge (€/año, si aplica)', numberInput(d.pensionCompensatoria, v => d.pensionCompensatoria = v ?? 0, { min: 0 })));
    container.appendChild(field('Anualidades por alimentos a favor de los hijos (€/año, si aplica)', numberInput(d.anualidadesPorAlimentos, v => d.anualidadesPorAlimentos = v ?? 0, { min: 0 })));
  }

  if (state.step === 4) {
    const tieneHijos = checkboxInput(d.descendientes.length > 0, v => {
      d.descendientes = v ? [{ anoNacimiento: 2015, computo: 'entero', discapacidad: null, movilidadReducida: false, rentasAnuales: 0, declaraIRPFMas1800: false }] : [];
      render();
    }, '¿Tiene descendientes a su cargo?');
    container.appendChild(tieneHijos);

    d.descendientes.forEach((desc, idx) => {
      const box = document.createElement('div');
      box.className = 'subbox';
      box.appendChild(h('h4', `Descendiente ${idx + 1}`));
      box.appendChild(field('Año de nacimiento', numberInput(desc.anoNacimiento, v => desc.anoNacimiento = v, { min: 1990 })));
      box.appendChild(field('Cómputo', selectInput(desc.computo, [['entero', 'Entero (100%)'], ['mitad', 'Mitad (50%, guarda compartida)']], v => desc.computo = v)));
      box.appendChild(field('Discapacidad', selectInput(desc.discapacidad ?? 'no', [['no', 'Sin discapacidad'], ['33-65', '33% - 64%'], ['65+', '≥ 65%']], v => desc.discapacidad = v === 'no' ? null : v)));
      box.appendChild(field('Rentas anuales del descendiente (€)', numberInput(desc.rentasAnuales, v => desc.rentasAnuales = v ?? 0, { min: 0 })));
      box.appendChild(checkboxInput(desc.declaraIRPFMas1800, v => desc.declaraIRPFMas1800 = v, 'Presenta declaración de IRPF con rentas superiores a 1.800 €'));
      const removeBtn = h('button', 'Eliminar descendiente');
      removeBtn.type = 'button';
      removeBtn.className = 'link-btn';
      removeBtn.addEventListener('click', () => { d.descendientes.splice(idx, 1); render(); });
      box.appendChild(removeBtn);
      container.appendChild(box);
    });
    if (d.descendientes.length > 0) {
      const addBtn = h('button', '+ Añadir otro descendiente');
      addBtn.type = 'button';
      addBtn.className = 'link-btn';
      addBtn.addEventListener('click', () => { d.descendientes.push({ anoNacimiento: 2018, computo: 'entero', discapacidad: null, movilidadReducida: false, rentasAnuales: 0, declaraIRPFMas1800: false }); render(); });
      container.appendChild(addBtn);
    }

    const tieneAscendientes = checkboxInput(d.ascendientes.length > 0, v => {
      d.ascendientes = v ? [{ edad: 70, conviven: true, discapacidad: null, movilidadReducida: false, personasConDerecho: 1 }] : [];
      render();
    }, '¿Tiene ascendientes a su cargo (mayores de 65 años que convivan con usted)?');
    container.appendChild(tieneAscendientes);

    d.ascendientes.forEach((asc, idx) => {
      const box = document.createElement('div');
      box.className = 'subbox';
      box.appendChild(h('h4', `Ascendiente ${idx + 1}`));
      box.appendChild(field('Edad', numberInput(asc.edad, v => asc.edad = v, { min: 65 })));
      box.appendChild(field('Discapacidad', selectInput(asc.discapacidad ?? 'no', [['no', 'Sin discapacidad'], ['33-65', '33% - 64%'], ['65+', '≥ 65%']], v => asc.discapacidad = v === 'no' ? null : v)));
      const removeBtn = h('button', 'Eliminar ascendiente');
      removeBtn.type = 'button';
      removeBtn.className = 'link-btn';
      removeBtn.addEventListener('click', () => { d.ascendientes.splice(idx, 1); render(); });
      box.appendChild(removeBtn);
      container.appendChild(box);
    });
  }

  if (state.step === 5) {
    container.appendChild(checkboxInput(!!d.discapacidadContribuyente, v => { d.discapacidadContribuyente = v ? '33-65' : null; render(); }, '¿Tiene usted alguna discapacidad reconocida?'));
    if (d.discapacidadContribuyente) {
      container.appendChild(field('Grado de discapacidad', selectInput(d.discapacidadContribuyente, [['33-65', '33% - 64%'], ['65+', '≥ 65%']], v => d.discapacidadContribuyente = v)));
      container.appendChild(checkboxInput(d.movilidadReducidaContribuyente, v => d.movilidadReducidaContribuyente = v, 'Movilidad reducida o necesidad de ayuda de terceras personas'));
    }
  }

  if (state.step === 6) {
    container.appendChild(checkboxInput(d.viviendaHabitual.pagosConFinanciacion, v => { d.viviendaHabitual.pagosConFinanciacion = v; render(); }, 'Pago un préstamo para adquirir o rehabilitar mi vivienda habitual con financiación ajena'));
    if (d.viviendaHabitual.pagosConFinanciacion) {
      const hint = h('p', 'Si procede, el tipo de retención puede reducirse en 2 puntos cuando la retribución anual es inferior a 33.007,20 €.');
      hint.className = 'hint';
      container.appendChild(hint);
    }
    container.appendChild(checkboxInput(d.duracionContratoInferiorAno, v => d.duracionContratoInferiorAno = v, 'Contrato o relación laboral de duración inferior a un año'));
    container.appendChild(checkboxInput(d.relacionLaboralEspecial, v => d.relacionLaboralEspecial = v, 'Relación laboral especial sujeta al tipo mínimo específico'));
    if (d.relacionLaboralEspecial) container.appendChild(checkboxInput(d.penadoInstitucionPenitenciaria, v => d.penadoInstitucionPenitenciaria = v, 'Penado en institución penitenciaria'));
    container.appendChild(checkboxInput(d.ceutaMelilla, v => d.ceutaMelilla = v, 'Residencia habitual y efectiva en Ceuta o Melilla'));
    container.appendChild(checkboxInput(d.comunidadForal, v => d.comunidadForal = v, 'Tributa en País Vasco o Navarra (régimen foral)'));
    if (d.comunidadForal) {
      const warn = h('p', 'El cálculo estatal de IRPF no resulta aplicable como cálculo exacto a estos territorios debido a su normativa foral. Podemos calcular su Seguridad Social, pero el IRPF se mostrará solo como orientativo.');
      warn.className = 'warning';
      container.appendChild(warn);
    }
  }

  if (state.step === 7) {
    container.appendChild(renderResultado());
  }

  return container;
}

function renderResultado() {
  const input = { ...state.data };
  let resultado;
  try {
    resultado = calculateNetSalary(input, datosNormativos);
  } catch (err) {
    const errBox = document.createElement('div');
    errBox.className = 'warning';
    errBox.textContent = 'No se ha podido calcular: ' + err.message;
    return errBox;
  }

  const wrap = document.createElement('div');

  const card = document.createElement('div');
  card.className = 'result-card';
  const label = h('div', 'NETO MENSUAL');
  label.className = 'result-label';
  const value = h('div', fmtEUR(resultado.resumen.netoMensual));
  value.className = 'result-value';
  card.appendChild(label);
  card.appendChild(value);

  const rows = [
    ['Bruto mensual', resultado.resumen.brutoMensual, 'pos'],
    ['Seguridad Social', -resultado.resumen.seguridadSocialMensual, 'neg'],
    ['IRPF', -resultado.resumen.irpfMensual, 'neg']
  ];
  const table = document.createElement('div');
  table.className = 'mini-table';
  rows.forEach(([l, v]) => {
    const row = document.createElement('div');
    row.className = 'mini-row';
    row.innerHTML = `<span>${l}</span><span class="tabular">${v < 0 ? '-' : ''}${fmtEUR(Math.abs(v))}</span>`;
    table.appendChild(row);
  });
  const total = document.createElement('div');
  total.className = 'mini-row total';
  total.innerHTML = `<span>NETO</span><span class="tabular">${fmtEUR(resultado.resumen.netoMensual)}</span>`;
  table.appendChild(total);
  card.appendChild(table);
  wrap.appendChild(card);

  if (resultado.avisoTerritorial) {
    const w = h('p', resultado.avisoTerritorial);
    w.className = 'warning';
    wrap.appendChild(w);
  }

  const grid = document.createElement('div');
  grid.className = 'summary-grid';
  const summaryItems = [
    ['Bruto anual', fmtEUR(resultado.resumen.brutoAnual)],
    ['SS anual', fmtEUR(resultado.resumen.seguridadSocialAnual)],
    ['IRPF anual', fmtEUR(resultado.resumen.irpfAnual)],
    ['Neto anual', fmtEUR(resultado.resumen.netoAnual)],
    ['Tipo IRPF', fmtPct(resultado.resumen.tipoIrpf)],
    ['Base de cotización', fmtEUR(resultado.resumen.baseCotizacion)]
  ];
  summaryItems.forEach(([l, v]) => {
    const item = document.createElement('div');
    item.className = 'summary-item';
    item.innerHTML = `<span class="summary-label">${l}</span><span class="summary-value tabular">${v}</span>`;
    grid.appendChild(item);
  });
  wrap.appendChild(grid);

  const detailBtn = h('button', 'Ver cálculo detallado');
  detailBtn.type = 'button';
  detailBtn.className = 'link-btn';
  const detailBox = document.createElement('div');
  detailBox.className = 'detail-box hidden';
  detailBtn.addEventListener('click', () => detailBox.classList.toggle('hidden'));

  detailBox.appendChild(h('h4', 'Desglose de Seguridad Social'));
  const ssRows = [
    ['Contingencias comunes', resultado.seguridadSocial.desglose.contingenciasComunes],
    ['MEI', resultado.seguridadSocial.desglose.mei],
    [`Desempleo (${resultado.seguridadSocial.desglose.desempleo.tipoContrato})`, resultado.seguridadSocial.desglose.desempleo.importe],
    ['Formación profesional', resultado.seguridadSocial.desglose.formacionProfesional]
  ];
  if (resultado.seguridadSocial.desglose.solidaridad.aplica) {
    ssRows.push(['Cotización adicional de solidaridad', resultado.seguridadSocial.desglose.solidaridad.totalTrabajador]);
  }
  ssRows.push(['TOTAL SS TRABAJADOR (mensual)', resultado.seguridadSocial.totalMensual]);
  detailBox.appendChild(buildDetailTable(ssRows));

  detailBox.appendChild(h('h4', 'Desglose de IRPF (anual)'));
  const irpfRows = [
    ['Retribución anual', resultado.irpf.retribucionAnual],
    ['− Cotizaciones SS', -resultado.irpf.gastosSS],
    ['− Gastos deducibles', -resultado.irpf.otrosGastosDeducibles],
    ['= Rendimiento neto del trabajo', resultado.irpf.rendimientoNetoTrabajo],
    ['− Reducción por rendimientos del trabajo', -resultado.irpf.reduccionTrabajo],
    ['− Reducciones especiales', -resultado.irpf.reduccionesEspeciales.total],
    ['= Rendimiento neto reducido', resultado.irpf.rendimientoNetoReducido],
    ['Base para calcular el tipo', resultado.irpf.baseParaCalcularElTipo],
    ['Mínimo personal y familiar', resultado.irpf.minimoPersonalYFamiliar.total],
    ['Cuota de retención', resultado.irpf.cuotaRetencion],
    ['Tipo de retención (truncado)', resultado.irpf.tipoRetencion + ' %'],
    ['Importe anual retenido', resultado.irpf.irpfAnual]
  ];
  detailBox.appendChild(buildDetailTable(irpfRows));

  const legal = h('p', resultado.avisoLegal);
  legal.className = 'legal-note';
  detailBox.appendChild(legal);
  const legal2 = h('p', 'El porcentaje de IRPF calculado corresponde a la retención aplicable en nómina según el algoritmo estatal de la AEAT. La declaración anual de la renta puede producir un resultado diferente.');
  legal2.className = 'legal-note';
  detailBox.appendChild(legal2);

  wrap.appendChild(detailBtn);
  wrap.appendChild(detailBox);

  return wrap;
}

function buildDetailTable(rows) {
  const table = document.createElement('div');
  table.className = 'mini-table detail';
  rows.forEach(([l, v]) => {
    const row = document.createElement('div');
    row.className = 'mini-row';
    const valStr = typeof v === 'number' ? (v < 0 ? '-' + fmtEUR(Math.abs(v)) : fmtEUR(v)) : v;
    row.innerHTML = `<span>${l}</span><span class="tabular">${valStr}</span>`;
    table.appendChild(row);
  });
  return table;
}

function renderNav() {
  const nav = document.createElement('div');
  nav.className = 'nav';
  if (state.step > 1) {
    const back = h('button', '← Atrás');
    back.type = 'button';
    back.className = 'btn secondary';
    back.addEventListener('click', () => { state.step -= 1; render(); });
    nav.appendChild(back);
  } else {
    nav.appendChild(document.createElement('span'));
  }
  if (state.step < TOTAL_STEPS) {
    const next = h('button', state.step === TOTAL_STEPS - 1 ? 'Ver resultado →' : 'Continuar →');
    next.type = 'button';
    next.className = 'btn primary';
    next.addEventListener('click', () => { state.step += 1; render(); });
    nav.appendChild(next);
  } else {
    const restart = h('button', 'Empezar de nuevo');
    restart.type = 'button';
    restart.className = 'btn secondary';
    restart.addEventListener('click', () => { state.step = 1; render(); });
    nav.appendChild(restart);
  }
  return nav;
}

render();
