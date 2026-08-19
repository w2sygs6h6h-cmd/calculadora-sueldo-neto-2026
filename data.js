export const ssParams = {
  "year": 2026,
  "source": "Orden PJC/297/2026, de 30 de marzo (BOE-A-2026-7296)",
  "sourceUrl": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
  "params": {
    "topeMaximoMensual": {
      "name": "tope_maximo_cotizacion_mensual",
      "value": 5101.2,
      "unit": "EUR/mes",
      "effectiveFrom": "2026-01-01",
      "source": "Orden PJC/297/2026",
      "article": "Art. 2",
      "url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
      "verified": true
    },
    "topeMinimoContingenciasProfesionales": {
      "name": "tope_minimo_contingencias_profesionales",
      "value": 1424.4,
      "unit": "EUR/mes",
      "effectiveFrom": "2026-01-01",
      "source": "Orden PJC/297/2026",
      "article": "Art. 2",
      "url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
      "verified": true
    },
    "basesMinimasMensualesPorGrupo": {
      "1": {
        "value": 1989.3,
        "unit": "EUR/mes"
      },
      "2": {
        "value": 1649.7,
        "unit": "EUR/mes"
      },
      "3": {
        "value": 1435.2,
        "unit": "EUR/mes"
      },
      "4": {
        "value": 1424.4,
        "unit": "EUR/mes"
      },
      "5": {
        "value": 1424.4,
        "unit": "EUR/mes"
      },
      "6": {
        "value": 1424.4,
        "unit": "EUR/mes"
      },
      "7": {
        "value": 1424.4,
        "unit": "EUR/mes"
      },
      "_meta": {
        "name": "bases_minimas_mensuales_grupos_1_7",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 3",
        "url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
        "verified": true
      }
    },
    "basesDiariasGrupos8a11": {
      "minimaDia": {
        "name": "base_minima_diaria_grupos_8_11",
        "value": 47.48,
        "unit": "EUR/dia",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 3",
        "url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
        "verified": true
      },
      "maximaDia": {
        "name": "base_maxima_diaria_grupos_8_11",
        "value": 170.04,
        "unit": "EUR/dia",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 3",
        "url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
        "verified": true
      }
    },
    "basesMinimasHorariasParcial": {
      "1": {
        "value": 11.98,
        "unit": "EUR/hora"
      },
      "2": {
        "value": 9.94,
        "unit": "EUR/hora"
      },
      "3": {
        "value": 8.65,
        "unit": "EUR/hora"
      },
      "4a11": {
        "value": 8.58,
        "unit": "EUR/hora"
      },
      "_meta": {
        "name": "bases_minimas_horarias_jornada_parcial",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 3",
        "url": "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
        "verified": true
      }
    },
    "tiposTrabajador": {
      "contingenciasComunes": {
        "name": "tipo_contingencias_comunes_trabajador",
        "value": 0.047,
        "unit": "rate",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 4.a",
        "verified": true
      },
      "mei": {
        "name": "tipo_mei_trabajador",
        "value": 0.0015,
        "unit": "rate",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 4.b",
        "verified": true
      },
      "desempleoIndefinido": {
        "name": "tipo_desempleo_trabajador_indefinido",
        "value": 0.0155,
        "unit": "rate",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 4.c",
        "verified": true
      },
      "desempleoTemporal": {
        "name": "tipo_desempleo_trabajador_temporal",
        "value": 0.016,
        "unit": "rate",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 4.c",
        "verified": true
      },
      "formacionProfesional": {
        "name": "tipo_formacion_profesional_trabajador",
        "value": 0.001,
        "unit": "rate",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 4.d",
        "verified": true
      }
    },
    "solidaridad": {
      "topeAplicacion": 5101.2,
      "tramos": [
        {
          "desde": 5101.21,
          "hasta": 5611.32,
          "tipoTotal": 0.0115,
          "tipoTrabajador": 0.0019,
          "name": "solidaridad_tramo_1",
          "source": "Orden PJC/297/2026",
          "article": "Disposición adicional - cotización adicional de solidaridad",
          "verified": true
        },
        {
          "desde": 5611.33,
          "hasta": 7651.8,
          "tipoTotal": 0.0125,
          "tipoTrabajador": 0.0021,
          "name": "solidaridad_tramo_2",
          "source": "Orden PJC/297/2026",
          "article": "Disposición adicional - cotización adicional de solidaridad",
          "verified": true
        },
        {
          "desde": 7651.81,
          "hasta": null,
          "tipoTotal": 0.0146,
          "tipoTrabajador": 0.0024,
          "name": "solidaridad_tramo_3",
          "source": "Orden PJC/297/2026",
          "article": "Disposición adicional - cotización adicional de solidaridad",
          "verified": true
        }
      ]
    },
    "contratosInferiores30Dias": {
      "cotizacionAdicionalEmpresa": {
        "name": "cotizacion_adicional_contratos_inferiores_30_dias",
        "value": 33.62,
        "unit": "EUR",
        "aCargoDe": "empresa",
        "effectiveFrom": "2026-01-01",
        "source": "Orden PJC/297/2026",
        "article": "Art. 26 LGSS / disposición correspondiente",
        "verified": true,
        "nota": "No se descuenta del salario neto del trabajador."
      }
    }
  }
};

export const irpfParams = {
  "minimoPersonal": {
    "general": {
      "name": "minimo_personal_general",
      "value": 5550,
      "unit": "EUR/año",
      "verified": true
    },
    "incremento65": {
      "name": "minimo_personal_incremento_65",
      "value": 1150,
      "unit": "EUR/año",
      "verified": true
    },
    "incremento75": {
      "name": "minimo_personal_incremento_75",
      "value": 1400,
      "unit": "EUR/año",
      "verified": true
    }
  },
  "minimosDescendientes": {
    "primero": {
      "name": "minimo_1er_descendiente",
      "value": 2400,
      "unit": "EUR/año",
      "verified": true
    },
    "segundo": {
      "name": "minimo_2o_descendiente",
      "value": 2700,
      "unit": "EUR/año",
      "verified": true
    },
    "tercero": {
      "name": "minimo_3er_descendiente",
      "value": 4000,
      "unit": "EUR/año",
      "verified": true
    },
    "cuartoYSiguientes": {
      "name": "minimo_4o_y_siguientes_descendientes",
      "value": 4500,
      "unit": "EUR/año",
      "verified": true
    },
    "menorDe3Anos": {
      "name": "incremento_descendiente_menor_3_anos",
      "value": 2800,
      "unit": "EUR/año",
      "verified": true
    }
  },
  "minimosAscendientes": {
    "mayor65": {
      "name": "minimo_ascendiente_65",
      "value": 1150,
      "unit": "EUR/año",
      "verified": true
    },
    "incremento75": {
      "name": "minimo_ascendiente_incremento_75",
      "value": 1400,
      "unit": "EUR/año",
      "verified": true
    }
  },
  "discapacidad": {
    "contribuyente33a65": {
      "name": "min_discapacidad_contribuyente_33_65",
      "value": 3000,
      "unit": "EUR/año",
      "verified": true
    },
    "contribuyenteMayor65": {
      "name": "min_discapacidad_contribuyente_65",
      "value": 9000,
      "unit": "EUR/año",
      "verified": true
    },
    "incrementoMovilidad": {
      "name": "incremento_asistencia_movilidad_reducida",
      "value": 3000,
      "unit": "EUR/año",
      "verified": true
    }
  },
  "gastosDeducibles": {
    "general": {
      "name": "gasto_deducible_general",
      "value": 2000,
      "unit": "EUR/año",
      "verified": true
    },
    "movilidadGeografica": {
      "name": "gasto_deducible_movilidad_geografica",
      "value": 2000,
      "unit": "EUR/año",
      "verified": true
    },
    "trabajadorActivoDiscapacidad33a65": {
      "name": "gasto_deducible_discapacidad_33_65",
      "value": 3500,
      "unit": "EUR/año",
      "verified": true
    },
    "trabajadorActivoDiscapacidad65OMas": {
      "name": "gasto_deducible_discapacidad_65_o_movilidad",
      "value": 7750,
      "unit": "EUR/año",
      "verified": true
    }
  },
  "reduccionRendimientoTrabajo": {
    "tramo1": {
      "limiteRNT": 14852,
      "reduccion": 7302
    },
    "tramo2": {
      "limiteRNTdesde": 14852,
      "limiteRNThasta": 17673.52,
      "base": 7302,
      "coeficiente": 1.75
    },
    "tramo3": {
      "limiteRNTdesde": 17673.52,
      "limiteRNThasta": 19747.5,
      "base": 2364.34,
      "coeficiente": 1.14
    },
    "tramo4": {
      "limiteRNTdesde": 19747.5,
      "reduccion": 0
    }
  },
  "reduccionesEspeciales": {
    "pensionista": {
      "name": "reduccion_pensionista",
      "value": 600,
      "unit": "EUR/año",
      "verified": true
    },
    "masDeDosDescendientes": {
      "name": "reduccion_mas_2_descendientes",
      "value": 600,
      "unit": "EUR/año",
      "verified": true
    },
    "desempleado": {
      "name": "reduccion_desempleado",
      "value": 1200,
      "unit": "EUR/año",
      "verified": true
    }
  },
  "limitesExcluyentesRetencion": {
    "situacion1": {
      "0": null,
      "1": 17644,
      "2": 18694
    },
    "situacion2": {
      "0": 17197,
      "1": 18130,
      "2": 19262
    },
    "situacion3": {
      "0": 15876,
      "1": 16342,
      "2": 16867
    }
  },
  "limite43PorCiento": {
    "name": "limite_incremento_retencion_43_por_cien",
    "coeficiente": 0.43,
    "descripcion": "Cuando la retribución supera el límite excluyente de retención, la cuota de retención no puede minorar el líquido a percibir en más del 43% del exceso sobre dicho límite.",
    "verified": true
  },
  "escalaRetencion": [
    {
      "hasta": 12450,
      "desde": 0,
      "cuotaAcumulada": 0,
      "tipo": 0.19
    },
    {
      "hasta": 20200,
      "desde": 12450,
      "cuotaAcumulada": 2365.5,
      "tipo": 0.24
    },
    {
      "hasta": 35200,
      "desde": 20200,
      "cuotaAcumulada": 4225.5,
      "tipo": 0.3
    },
    {
      "hasta": 60000,
      "desde": 35200,
      "cuotaAcumulada": 8725.5,
      "tipo": 0.37
    },
    {
      "hasta": 300000,
      "desde": 60000,
      "cuotaAcumulada": 17901.5,
      "tipo": 0.45
    },
    {
      "hasta": null,
      "desde": 300000,
      "cuotaAcumulada": 125901.5,
      "tipo": 0.47
    }
  ],
  "tipoMaximo": 0.47,
  "viviendaHabitual": {
    "umbralRetribucion": 33007.2,
    "reduccionPuntos": 2.0,
    "descripcion": "Reducción de 2 puntos del tipo de retención por pagos destinados a adquisición/rehabilitación de vivienda habitual con financiación ajena, cuando proceda.",
    "source": "Reglamento IRPF art. 86.1 / disposición transitoria decimoctava LIRPF",
    "sourceUrl": "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820",
    "verified": true
  }
};

export const smiParams = {
  "year": 2026,
  "source": "Real Decreto 126/2026, de 18 de febrero (BOE-A-2026-3815)",
  "sourceUrl": "https://www.boe.es",
  "params": {
    "smiAnual14Pagas": {
      "name": "smi_anual_14_pagas",
      "value": 17094,
      "unit": "EUR/año",
      "effectiveFrom": "2026-01-01",
      "source": "Real Decreto 126/2026",
      "verified": true
    }
  }
};
