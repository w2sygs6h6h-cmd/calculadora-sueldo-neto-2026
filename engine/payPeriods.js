import { roundAEAT } from './rounding.js';

/**
 * Reparte un importe anual entre el número de pagas, SIN alterar el tipo/
 * importe anual ya calculado (sección 28: no cambiar el tipo anual por
 * tener 12 o 14 pagas).
 *
 * - 12 pagas: bruto mensual = bruto anual / 12 (pagas extra prorrateadas).
 * - 14 pagas: bruto mensual ordinario = bruto anual / 14; las dos pagas
 *   extraordinarias se pagan por el mismo importe (bruto anual / 14) en los
 *   meses que corresponda, ya integradas en el total anual.
 *
 * La Seguridad Social SIEMPRE se calcula sobre la base mensual prorrateada
 * (bruto anual / 12), igual en ambos esquemas de pago (ver socialSecurity.js).
 * El IRPF se calcula sobre el importe ANUAL y después se reparte de forma
 * proporcional entre las pagas efectivamente satisfechas.
 */
export function repartirEnPagas({ brutoAnual, ssAnual, irpfAnual, numPagas }) {
  const brutoPorPaga = roundAEAT(brutoAnual / numPagas);
  const ssPorPaga = roundAEAT(ssAnual / numPagas);
  const irpfPorPaga = roundAEAT(irpfAnual / numPagas);
  const netoPorPaga = roundAEAT(brutoPorPaga - ssPorPaga - irpfPorPaga);

  return {
    numPagas,
    brutoPorPaga,
    ssPorPaga,
    irpfPorPaga,
    netoPorPaga,
    // Vista "mensual" homogénea (12 meses), útil para comparar 12 vs 14 pagas:
    brutoMensualEquivalente: roundAEAT(brutoAnual / 12),
    ssMensualEquivalente: roundAEAT(ssAnual / 12),
    irpfMensualEquivalente: roundAEAT(irpfAnual / 12),
    netoMensualEquivalente: roundAEAT((brutoAnual - ssAnual - irpfAnual) / 12)
  };
}
