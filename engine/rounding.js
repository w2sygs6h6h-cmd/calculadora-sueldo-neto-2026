/**
 * Motor de redondeos conforme al algoritmo AEAT.
 *
 * REDONDEAR1: redondeo aritmético a 2 decimales (si el tercer decimal es 5,
 * redondea hacia arriba). Se usa para todos los IMPORTES monetarios.
 *
 * TRUNCAR: truncamiento (no redondeo) a 2 decimales. Se usa EXCLUSIVAMENTE
 * para el TIPO DE RETENCIÓN (porcentaje), nunca para importes en euros.
 *
 * Ejemplo (sección 25 del encargo):
 *   17.85964523 %  ->  TRUNCAR  ->  17.85 %   (NO 17.86 %)
 */

// Pequeño margen para neutralizar el error de representación binaria de
// coma flotante (p. ej. 1.005 se representa internamente como
// 1.00499999999999989...), sin alterar el resultado de casos normales.
const EPS = 1e-9;

/**
 * Redondeo aritmético estándar a `decimals` decimales, con desempate hacia
 * arriba en el .5 exacto.
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function roundAEAT(value, decimals = 2) {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const sign = scaled < 0 ? -1 : 1;
  const rounded = Math.floor(Math.abs(scaled) + 0.5 + EPS) * sign;
  return rounded / factor;
}

/**
 * Truncamiento (parte entera hacia cero) a `decimals` decimales.
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function truncateAEAT(value, decimals = 2) {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const sign = scaled < 0 ? -1 : 1;
  const truncated = Math.floor(Math.abs(scaled) + EPS) * sign;
  return truncated / factor;
}
