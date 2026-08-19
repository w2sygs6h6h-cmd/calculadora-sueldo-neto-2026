import { roundAEAT } from './rounding.js';

/**
 * Determina la base mínima legal mensual de cotización según grupo y jornada.
 *
 * - Grupos 1-7: base mínima mensual fija (data/2026/social-security.json).
 * - Grupos 8-11: base mínima diaria x 30 días (mes "tipo" de cotización).
 * - Jornada parcial (cualquier grupo): base mínima = horas trabajadas x base
 *   mínima horaria del grupo (Art. 3 Orden PJC/297/2026).
 */
function baseMinimaLegalMensual(input, ssParams) {
  const { jornada, grupoCotizacion, horasMensuales } = input;

  if (jornada === 'parcial') {
    const horaria = basesHorarias(ssParams)[grupoCotizacion] ?? ssParams.params.basesMinimasHorariasParcial['4a11'].value;
    return roundAEAT(horaria * horasMensuales);
  }

  if (grupoCotizacion >= 8 && grupoCotizacion <= 11) {
    const diaria = ssParams.params.basesDiariasGrupos8a11.minimaDia.value;
    const DIAS_MES_TIPO = 30;
    return roundAEAT(diaria * DIAS_MES_TIPO);
  }

  const grupo = ssParams.params.basesMinimasMensualesPorGrupo[String(grupoCotizacion)];
  if (!grupo) {
    throw new Error(`Grupo de cotización no soportado en V1: ${grupoCotizacion}`);
  }
  return grupo.value;
}

function basesHorarias(ssParams) {
  const h = ssParams.params.basesMinimasHorariasParcial;
  return {
    1: h['1'].value,
    2: h['2'].value,
    3: h['3'].value,
    4: h['4a11'].value,
    5: h['4a11'].value,
    6: h['4a11'].value,
    7: h['4a11'].value,
    8: h['4a11'].value,
    9: h['4a11'].value,
    10: h['4a11'].value,
    11: h['4a11'].value
  };
}

/**
 * Calcula la cotización adicional de solidaridad de forma PROGRESIVA sobre
 * la remuneración mensual que excede el tope máximo de cotización.
 * NUNCA aplica el tipo de un tramo a la totalidad del salario.
 */
function calcularSolidaridad(remuneracionMensual, ssParams) {
  const { tramos, topeAplicacion } = ssParams.params.solidaridad;
  const desglose = [];
  let totalTrabajador = 0;

  if (remuneracionMensual <= topeAplicacion) {
    return { aplica: false, desglose: [], totalTrabajador: 0 };
  }

  for (const tramo of tramos) {
    if (remuneracionMensual < tramo.desde) continue;
    // El tramo empieza justo donde termina el tope general / tramo anterior.
    const inicioTramo = tramo.desde - 0.01;
    const techoTramo = tramo.hasta === null ? remuneracionMensual : tramo.hasta;
    const porcionEnTramo = Math.max(0, Math.min(remuneracionMensual, techoTramo) - inicioTramo);
    if (porcionEnTramo <= 0) continue;

    const importeTrabajador = roundAEAT(porcionEnTramo * tramo.tipoTrabajador);
    desglose.push({
      tramo: tramo.name,
      desde: tramo.desde,
      hasta: tramo.hasta,
      porcionEnTramo: roundAEAT(porcionEnTramo),
      tipoTrabajador: tramo.tipoTrabajador,
      importeTrabajador
    });
    totalTrabajador += importeTrabajador;
  }

  return { aplica: true, desglose, totalTrabajador: roundAEAT(totalTrabajador) };
}

/**
 * Motor de Seguridad Social del trabajador (Régimen General, 2026).
 *
 * @param {object} input
 * @param {number} input.brutoAnual - retribución anual computable total
 * @param {'completa'|'parcial'} input.jornada
 * @param {number} input.grupoCotizacion - 1 a 11
 * @param {number} [input.horasMensuales] - obligatorio si jornada = 'parcial'
 * @param {'indefinido'|'temporal'} input.tipoContrato
 * @param {object} ssParams - data/2026/social-security.json
 * @returns {object} desglose completo de la cotización del trabajador
 */
export function calculateSocialSecurity(input, ssParams) {
  const { brutoAnual, jornada, tipoContrato } = input;

  if (jornada === 'parcial' && (!input.horasMensuales || input.horasMensuales <= 0)) {
    throw new Error('Las horas trabajadas son obligatorias para jornada parcial.');
  }

  const remuneracionMensual = roundAEAT(brutoAnual / 12);
  const topeMaximo = ssParams.params.topeMaximoMensual.value;

  const minimaLegal = baseMinimaLegalMensual(input, ssParams);
  let baseCotizacion = Math.max(remuneracionMensual, minimaLegal);
  baseCotizacion = Math.min(baseCotizacion, topeMaximo);
  baseCotizacion = roundAEAT(baseCotizacion);

  const tipos = ssParams.params.tiposTrabajador;
  const tipoDesempleo = tipoContrato === 'temporal' ? tipos.desempleoTemporal.value : tipos.desempleoIndefinido.value;

  const contingenciasComunes = roundAEAT(baseCotizacion * tipos.contingenciasComunes.value);
  const mei = roundAEAT(baseCotizacion * tipos.mei.value);
  const desempleo = roundAEAT(baseCotizacion * tipoDesempleo);
  const formacionProfesional = roundAEAT(baseCotizacion * tipos.formacionProfesional.value);

  const solidaridad = calcularSolidaridad(remuneracionMensual, ssParams);

  const totalMensual = roundAEAT(
    contingenciasComunes + mei + desempleo + formacionProfesional + solidaridad.totalTrabajador
  );

  return {
    baseCotizacionMensual: baseCotizacion,
    remuneracionMensual,
    baseMinimaLegalAplicada: minimaLegal,
    topeMaximoAplicado: baseCotizacion === topeMaximo,
    desglose: {
      contingenciasComunes,
      mei,
      desempleo: { importe: desempleo, tipo: tipoDesempleo, tipoContrato },
      formacionProfesional,
      solidaridad
    },
    totalMensual,
    totalAnual: roundAEAT(totalMensual * 12)
  };
}
