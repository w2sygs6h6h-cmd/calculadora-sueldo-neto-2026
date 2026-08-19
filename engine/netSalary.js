import { calculateSocialSecurity } from './socialSecurity.js';
import { calculateIrpf } from './irpf.js';
import { repartirEnPagas } from './payPeriods.js';
import { roundAEAT } from './rounding.js';

/**
 * Función pura principal: combina Seguridad Social + IRPF + reparto de
 * pagas para producir el resultado completo y trazable.
 *
 * @param {object} input - ver README "Contrato de entrada" para el detalle
 *   de todos los campos aceptados.
 * @param {object} datosNormativos - { ss, irpf } (contenido de los JSON en /data/2026)
 */
export function calculateNetSalary(input, datosNormativos) {
  const { ss: ssParams, irpf: irpfParams } = datosNormativos;

  const seguridadSocial = calculateSocialSecurity(
    {
      brutoAnual: input.brutoAnual,
      jornada: input.jornada,
      grupoCotizacion: input.grupoCotizacion,
      horasMensuales: input.horasMensuales,
      tipoContrato: input.tipoContrato
    },
    ssParams
  );

  const irpf = calculateIrpf(
    {
      retribucionAnual: input.brutoAnual,
      anoNacimiento: input.anoNacimiento,
      situacionFamiliar: input.situacionFamiliar,
      descendientes: input.descendientes,
      ascendientes: input.ascendientes,
      discapacidadContribuyente: input.discapacidadContribuyente,
      movilidadReducidaContribuyente: input.movilidadReducidaContribuyente,
      ceutaMelilla: input.ceutaMelilla,
      movilidadGeografica: input.movilidadGeografica,
      pensionCompensatoria: input.pensionCompensatoria,
      anualidadesPorAlimentos: input.anualidadesPorAlimentos,
      situacionLaboral: input.situacionLaboral,
      numPagas: input.numPagas,
      conyugeRentasAnuales: input.conyugeRentasAnuales,
      viviendaHabitual: input.viviendaHabitual,
      duracionContratoInferiorAno: input.duracionContratoInferiorAno,
      relacionLaboralEspecial: input.relacionLaboralEspecial,
      penadoInstitucionPenitenciaria: input.penadoInstitucionPenitenciaria
    },
    seguridadSocial.totalAnual,
    irpfParams
  );

  const pagas = repartirEnPagas({
    brutoAnual: input.brutoAnual,
    ssAnual: seguridadSocial.totalAnual,
    irpfAnual: irpf.irpfAnual,
    numPagas: input.numPagas
  });

  const netoAnual = roundAEAT(input.brutoAnual - seguridadSocial.totalAnual - irpf.irpfAnual);

  return {
    avisoTerritorial: input.comunidadForal
      ? 'El cálculo de Seguridad Social puede realizarse, pero la retención de IRPF está sometida a normativa foral (País Vasco / Navarra). Este cálculo de IRPF no es aplicable como resultado exacto.'
      : null,
    resumen: {
      brutoAnual: input.brutoAnual,
      brutoMensual: pagas.brutoMensualEquivalente,
      numPagas: input.numPagas,
      baseCotizacion: seguridadSocial.baseCotizacionMensual,
      seguridadSocialMensual: seguridadSocial.totalMensual,
      seguridadSocialAnual: seguridadSocial.totalAnual,
      irpfMensual: pagas.irpfMensualEquivalente,
      irpfAnual: irpf.irpfAnual,
      tipoIrpf: irpf.tipoRetencion,
      netoMensual: pagas.netoMensualEquivalente,
      netoAnual,
      netoPorPaga: pagas.netoPorPaga,
      brutoPorPaga: pagas.brutoPorPaga
    },
    seguridadSocial,
    irpf,
    pagas,
    avisoLegal: 'Estimación de retención en nómina conforme al algoritmo de la AEAT para 2026. El resultado de esta calculadora no sustituye una nómina emitida por la empresa ni determina el resultado final de la declaración anual de IRPF.'
  };
}
