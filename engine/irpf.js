import { roundAEAT, truncateAEAT } from './rounding.js';

/** Edad a 31/12 del ejercicio, según año de nacimiento (aproximación estándar del algoritmo). */
function edadFinAno(anoNacimiento, anioEjercicio) {
  return anioEjercicio - anoNacimiento;
}

/**
 * Reducción por obtención de rendimientos del trabajo, según tramos del RNT.
 * Sección 17 del encargo / algoritmo AEAT 2026.
 */
function reduccionRendimientoTrabajo(rnt, params) {
  const t = params.reduccionRendimientoTrabajo;
  if (rnt <= t.tramo1.limiteRNT) return t.tramo1.reduccion;
  if (rnt <= t.tramo2.limiteRNThasta) {
    return roundAEAT(t.tramo2.base - t.tramo2.coeficiente * (rnt - t.tramo2.limiteRNTdesde));
  }
  if (rnt < t.tramo3.limiteRNThasta) {
    return Math.max(0, roundAEAT(t.tramo3.base - t.tramo3.coeficiente * (rnt - t.tramo3.limiteRNTdesde)));
  }
  return 0;
}

/** Gastos deducibles distintos de la cotización a la Seguridad Social. */
function gastosDeduciblesOtros(input, params) {
  const g = params.gastosDeducibles;
  let total = g.general.value;
  if (input.movilidadGeografica) total += g.movilidadGeografica.value;
  if (input.situacionLaboral === 'activo' && input.discapacidadContribuyente) {
    total += input.discapacidadContribuyente === '65+'
      ? g.trabajadorActivoDiscapacidad65OMas.value
      : g.trabajadorActivoDiscapacidad33a65.value;
  }
  return total;
}

/** Reducciones especiales (sección 18). */
function reduccionesEspeciales(input, params, anioEjercicio) {
  const r = params.reduccionesEspeciales;
  let total = 0;
  const detalle = {};
  if (input.situacionLaboral === 'pensionista') { total += r.pensionista.value; detalle.pensionista = r.pensionista.value; }
  if (descendientesElegibles(input.descendientes, anioEjercicio).length > 2) { total += r.masDeDosDescendientes.value; detalle.masDe2Descendientes = r.masDeDosDescendientes.value; }
  if (input.situacionLaboral === 'desempleado') { total += r.desempleado.value; detalle.desempleado = r.desempleado.value; }
  return { total, detalle };
}

/** Mínimo personal (sección 12), incrementos por edad acumulativos. */
function minimoPersonal(input, params, anioEjercicio) {
  const mp = params.minimoPersonal;
  const edad = edadFinAno(input.anoNacimiento, anioEjercicio);
  let total = mp.general.value;
  if (edad >= 65) total += mp.incremento65.value;
  if (edad >= 75) total += mp.incremento75.value;
  return roundAEAT(total);
}

/** Mínimo por discapacidad del contribuyente (sección 15). */
function minimoDiscapacidadContribuyente(input, params) {
  if (!input.discapacidadContribuyente) return 0;
  const d = params.discapacidad;
  let total = input.discapacidadContribuyente === '65+' ? d.contribuyenteMayor65.value : d.contribuyente33a65.value;
  if (input.movilidadReducidaContribuyente) total += d.incrementoMovilidad.value;
  return total;
}

/** Mínimo por descendientes (sección 13), con orden, cómputo entero/mitad e incremento <3 años. */
function minimoDescendientes(descendientes, params, anioEjercicio) {
  const md = params.minimosDescendientes;
  const d = params.discapacidad;
  const elegibles = descendientesElegibles(descendientes, anioEjercicio);
  const importesPorOrden = [md.primero.value, md.segundo.value, md.tercero.value];
  let total = 0;
  const detalle = [];
  elegibles.forEach((desc, idx) => {
    const orden = idx + 1;
    const importeBase = orden <= 3 ? importesPorOrden[orden - 1] : md.cuartoYSiguientes.value;
    const factor = desc.computo === 'mitad' ? 0.5 : 1;
    let importe = importeBase;
    const edad = edadFinAno(desc.anoNacimiento, anioEjercicio);
    if (edad < 3 || desc.altaPorAdopcionOAcogimiento) importe += md.menorDe3Anos.value;
    if (desc.discapacidad) {
      importe += desc.discapacidad === '65+' ? d.contribuyenteMayor65.value : d.contribuyente33a65.value;
      if (desc.movilidadReducida) importe += d.incrementoMovilidad.value;
    }
    importe = roundAEAT(importe * factor);
    total += importe;
    detalle.push({ orden, importe, factor });
  });
  return { total: roundAEAT(total), detalle };
}

/** Mínimo por ascendientes (sección 14). */
function minimoAscendientes(ascendientes, params) {
  const ma = params.minimosAscendientes;
  const d = params.discapacidad;
  let total = 0;
  const detalle = [];
  (ascendientes ?? []).forEach((asc) => {
    if (!asc.conviven) return;
    const edad = asc.edad ?? null;
    if (edad === null || edad < 65) return;
    let importe = ma.mayor65.value;
    if (edad >= 75) importe += ma.incremento75.value;
    if (asc.discapacidad) {
      importe += asc.discapacidad === '65+' ? d.contribuyenteMayor65.value : d.contribuyente33a65.value;
      if (asc.movilidadReducida) importe += d.incrementoMovilidad.value;
    }
    const divisor = asc.personasConDerecho && asc.personasConDerecho > 1 ? asc.personasConDerecho : 1;
    importe = roundAEAT(importe / divisor);
    total += importe;
    detalle.push({ importe, divisor });
  });
  return { total: roundAEAT(total), detalle };
}

/** Aplica la escala estatal de retención (sección 20) a una base dada. Devuelve la cuota. */
function aplicarEscala(base, escala) {
  if (base <= 0) return 0;
  for (const t of escala) {
    if (t.hasta === null || base <= t.hasta) {
      const exceso = base - t.desde;
      return roundAEAT(t.cuotaAcumulada + exceso * t.tipo);
    }
  }
  const ultimo = escala[escala.length - 1];
  return roundAEAT(ultimo.cuotaAcumulada + (base - ultimo.desde) * ultimo.tipo);
}

/** Determina la categoría de nº de descendientes para la tabla de límites excluyentes (0, 1, 2+). */
function descendienteElegible(desc, anioEjercicio) {
  const edad = edadFinAno(desc.anoNacimiento, anioEjercicio);
  const tieneDiscapacidad = !!desc.discapacidad;
  const edadValida = edad < 25 || tieneDiscapacidad;
  const rentasValidas = (desc.rentasAnuales ?? 0) <= 8000;
  const declaracionValida = !desc.declaraIRPFMas1800;
  return edadValida && rentasValidas && declaracionValida;
}

function descendientesElegibles(descendientes, anioEjercicio) {
  return (descendientes ?? []).filter(d => descendienteElegible(d, anioEjercicio));
}

function categoriaDescendientes(descendientes, anioEjercicio) {
  const n = descendientesElegibles(descendientes, anioEjercicio).length;
  if (n >= 2) return '2';
  return String(n);
}

/**
 * Motor de IRPF (retención en nómina). Implementa la secuencia:
 * RT -> gastos deducibles -> RNT -> reducción trabajo -> reducciones
 * especiales -> RNRT -> (pensión compensatoria / anualidades) -> base para
 * calcular el tipo -> mínimo personal y familiar -> cuota de retención ->
 * límites -> tipo de retención (truncado) -> importe anual.
 *
 * @param {object} input
 * @param {number} ssTrabajadorAnual - cotización SS anual del trabajador (motor de Seguridad Social)
 * @param {object} irpfParams - data/2026/irpf.json .params
 * @param {number} [anioEjercicio=2026]
 */
export function calculateIrpf(input, ssTrabajadorAnual, irpfParams, anioEjercicio = 2026) {
  const RT = input.retribucionAnual;

  if (input.situacionFamiliar === 2 && (input.conyugeRentasAnuales ?? 0) > 1500) {
    throw new Error('La situación familiar 2 solo procede cuando el cónyuge no obtiene rentas anuales superiores a 1.500 €.');
  }

  // 1-3: Rendimiento neto del trabajo (RNT)
  // IMPORTANTE: la AEAT calcula RNT restando cotizaciones (y, si procede,
  // rendimientos irregulares), pero NO los otros gastos de 2.000 € todavía.
  // Esos otros gastos se restan después de calcular RED20.
  const gastosSS = roundAEAT(ssTrabajadorAnual);
  const otrosGastosBrutos = gastosDeduciblesOtros(input, irpfParams);
  const RNT = Math.max(0, roundAEAT(RT - gastosSS));
  // La AEAT limita OTROSGASTOS a RETRIB - COTIZACIONES.
  const otrosGastosDeducibles = Math.max(0, Math.min(otrosGastosBrutos, RNT));

  // 4: Reducción por obtención de rendimientos del trabajo
  const reduccionTrabajo = reduccionRendimientoTrabajo(RNT, irpfParams);

  // 5: Rendimiento neto reducido del trabajo (RNTRDU)
  // Secuencia exacta del algoritmo AEAT: RNT - OTROSGASTOS - RED20.
  const RNRT = Math.max(0, roundAEAT(RNT - otrosGastosDeducibles - reduccionTrabajo));

  // 6: Reducciones especiales (pensión, >2 descendientes, desempleo) se
  // aplican posteriormente al construir BASE.
  const especiales = reduccionesEspeciales(input, irpfParams, anioEjercicio);

  // 7: Reducciones que forman parte de BASE. Las anualidades por alimentos
  // NO se restan aquí: el algoritmo las separa después en CUOTA1.
  const pensionCompensatoria = input.pensionCompensatoria ?? 0;
  const anualidadesAlimentos = input.anualidadesPorAlimentos ?? 0;
  const baseParaTarifa = Math.max(0, roundAEAT(
    RNRT - pensionCompensatoria - especiales.total
  ));

  // 8: Mínimo personal y familiar (MPF)
  const minPersonal = minimoPersonal(input, irpfParams, anioEjercicio);
  const minDiscapacidadContrib = minimoDiscapacidadContribuyente(input, irpfParams);
  const minDescendientes = minimoDescendientes(input.descendientes, irpfParams, anioEjercicio);
  const minAscendientes = minimoAscendientes(input.ascendientes, irpfParams);
  const MPF = roundAEAT(minPersonal + minDiscapacidadContrib + minDescendientes.total + minAscendientes.total);

  // 9: Cuota de retención según la secuencia AEAT 2026.
  // Con anualidades: BASE se divide en BASE1=BASE-ANUALIDADES y
  // BASE2=ANUALIDADES, siempre que BASE-ANUALIDADES > 0.
  const escala = irpfParams.escalaRetencion;
  const hayAnualidadesSeparables = anualidadesAlimentos > 0 && (baseParaTarifa - anualidadesAlimentos) > 0;
  const cuota1 = hayAnualidadesSeparables
    ? roundAEAT(aplicarEscala(baseParaTarifa - anualidadesAlimentos, escala) + aplicarEscala(anualidadesAlimentos, escala))
    : aplicarEscala(baseParaTarifa, escala);
  const cuota2 = aplicarEscala(
    MPF + (hayAnualidadesSeparables ? 1980 : 0),
    escala
  );
  let cuota = cuota1 > cuota2 ? roundAEAT(cuota1 - cuota2) : 0;

  // 10: Límite excluyente y regla del 43 %. El 43 % solo existe cuando
  // RETRIB <= 35.200 €, y el umbral incorpora pensión compensatoria y
  // desempleo tal como exige el algoritmo AEAT.
  const limites = irpfParams.limitesExcluyentesRetencion[`situacion${input.situacionFamiliar}`];
  const categoria = categoriaDescendientes(input.descendientes, anioEjercicio);
  const umbralBase = limites ? limites[categoria] : null;
  const pensionParaLimite = pensionCompensatoria;
  const desemParaLimite = input.situacionLaboral === 'desempleado' ? 1200 : 0;
  const umbral = umbralBase === null || umbralBase === undefined
    ? null
    : umbralBase + pensionParaLimite + desemParaLimite;

  let cuotaFinal = cuota;
  let motivoExencion = null;

  if (umbral !== null && RT <= umbral) {
    cuotaFinal = 0;
    motivoExencion = 'RT no supera el límite excluyente de retención para su situación familiar y nº de descendientes.';
  } else if (RT <= 35200) {
    let limite43 = null;
    const n = (input.descendientes ?? []).length;
    if (input.situacionFamiliar === 1) {
      if (n === 1) limite43 = (RT - (17644 + pensionParaLimite + desemParaLimite)) * 0.43;
      else if (n > 1) limite43 = (RT - (18694 + pensionParaLimite + desemParaLimite)) * 0.43;
    } else if (input.situacionFamiliar === 2) {
      if (n === 0) limite43 = (RT - (17197 + pensionParaLimite + desemParaLimite)) * 0.43;
      else if (n === 1) limite43 = (RT - (18130 + pensionParaLimite + desemParaLimite)) * 0.43;
      else limite43 = (RT - (19262 + pensionParaLimite + desemParaLimite)) * 0.43;
    } else {
      if (n === 0) limite43 = (RT - (15876 + pensionParaLimite + desemParaLimite)) * 0.43;
      else if (n === 1) limite43 = (RT - (16342 + pensionParaLimite + desemParaLimite)) * 0.43;
      else limite43 = (RT - (16867 + pensionParaLimite + desemParaLimite)) * 0.43;
    }
    if (limite43 !== null && cuotaFinal > limite43) {
      cuotaFinal = Math.max(0, roundAEAT(limite43));
      motivoExencion = 'Cuota limitada por la regla del 43% del exceso sobre el límite excluyente.';
    }
  }

  // 11: Ceuta/Melilla se aplica DESPUÉS del límite del 43 %, no antes.
  if (input.ceutaMelilla) {
    cuotaFinal = roundAEAT(cuotaFinal * 0.40);
  }

  // 12: Tipo de retención — TRUNCADO a 2 decimales (nunca redondeado)
  let tipoRetencion = RT > 0 ? truncateAEAT((cuotaFinal / RT) * 100) : 0;

  // Reducción de 2 puntos por adquisición/rehabilitación de vivienda habitual
  // con financiación ajena, cuando el contribuyente la ha comunicado al pagador
  // y cumple el umbral legal de retribuciones.
  const vivienda = irpfParams.viviendaHabitual ?? {};
  if (input.viviendaHabitual && input.viviendaHabitual.pagosConFinanciacion && RT < (vivienda.umbralRetribucion ?? 0)) {
    tipoRetencion = Math.max(0, truncateAEAT(tipoRetencion - (vivienda.reduccionPuntos ?? 2)));
  }

  // Tipos mínimos: 2 % para contratos/relaciones de duración inferior al año
  // y 15 % para relaciones laborales especiales, con las excepciones legales.
  if (input.duracionContratoInferiorAno && !(input.ceutaMelilla && input.discapacidadContribuyente)) {
    const minimoContrato = input.ceutaMelilla ? 0.8 : 2;
    tipoRetencion = Math.max(tipoRetencion, minimoContrato);
  }
  if (input.relacionLaboralEspecial && !input.penadoInstitucionPenitenciaria && !input.discapacidadContribuyente) {
    const minimoEspecial = input.ceutaMelilla ? 6 : 15;
    tipoRetencion = Math.max(tipoRetencion, minimoEspecial);
  }

  const tipoMaximo = irpfParams.tipoMaximo * 100;
  if (tipoRetencion > tipoMaximo) tipoRetencion = tipoMaximo;
  if (tipoRetencion < 0) tipoRetencion = 0;

  // 13: Importe anual de retención = RT x tipo truncado (magnitud final REDONDEAR1)
  const irpfAnual = roundAEAT(RT * (tipoRetencion / 100));

  return {
    retribucionAnual: RT,
    gastosSS,
    otrosGastosDeducibles,
    rendimientoNetoTrabajo: RNT,
    reduccionTrabajo,
    reduccionesEspeciales: especiales,
    rendimientoNetoReducido: RNRT,
    pensionCompensatoria,
    anualidadesPorAlimentos: anualidadesAlimentos,
    baseParaCalcularElTipo: baseParaTarifa,
    minimoPersonalYFamiliar: {
      total: MPF,
      minimoPersonal: minPersonal,
      minimoDiscapacidadContribuyente: minDiscapacidadContrib,
      minimoDescendientes: minDescendientes,
      minimoAscendientes: minAscendientes
    },
    cuotaAntesDeLimites: cuota,
    umbralExclusion: umbral,
    cuotaRetencion: cuotaFinal,
    motivoAjuste: motivoExencion,
    tipoRetencion,
    viviendaHabitual: input.viviendaHabitual ?? null,
    irpfAnual,
    irpfMensualBase: input.numPagas ? roundAEAT(irpfAnual / input.numPagas) : null
  };
}
