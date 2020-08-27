// CONFIGS
// On définit chaque tranche d'imposition
const TAX_SLICES = [
  {
    from: 0, // Inclus (>= 0)
    to: 10065, // Exclus (< 10065)
    tax: 0,
  },
  {
    from: 10065,
    to: 25660,
    tax: 11,
  },
  {
    from: 25660,
    to: 73370,
    tax: 30,
  },
  {
    from: 73370,
    to: 157807,
    tax: 41,
  },
  {
    from: 157807,
    to: Infinity,
    tax: 45,
  },
]

// TYPES
declare global {
  interface ITaxSlice {
    from: number
    to: number

    value: number
  }
}

// EXPORTS
export default function getTax(
  values: IValues,
  family_quotient: number
): [number, ITaxSlice[]] {
  // On récupère le revenu brut et on le divise par le quotient familial
  let { gross_income } = values
  gross_income /= family_quotient

  // Si les revenus sont inférieur ou compris dans la première tranche, inutile de calculer l'impôt
  if (gross_income < TAX_SLICES[0].to) {
    return [
      0,
      [
        {
          ...TAX_SLICES[0],
          value: 0,
        },
      ],
    ]
  }

  // Ce tableau contiendra chaque tranche d'imposition utilisée
  const slices: ITaxSlice[] = []

  // Pour chaque tranched d'imposition
  for (const slice of TAX_SLICES) {
    // On définit si c'est la dernière tranche utilisée, en gros si le revenu brut est compris dans cette tranche
    const lastSlice = gross_income < slice.to

    // On ajoute cette tranche à celles qui sont utilisées
    slices.push({
      from: slice.from,
      to: slice.to,

      value:
        // Si dernière tranche, on compte depuis le revenu brut, sinon depuis la fin de la tranche
        ((lastSlice ? gross_income : slice.to - 1) - slice.from) *
        (slice.tax / 100),
    })

    // Si dernière tranche, inutile d'aller plus loin
    if (lastSlice) break
  }

  return [
    // On parcourt toutes les tranches utilsiées et on additionne leurs montants
    // Ensuite on multiplie le résultat par le quotient familial
    // Et pour finir on arrondit au centième
    Math.round(
      slices.reduce((curr, e) => curr + e.value, 0) * family_quotient * 100
    ) / 100,
    // On arrondit le montant chaque tranche imposée au centième (uniquement pour l'affichage)
    slices.map((e) => ({ ...e, value: Math.round(e.value * 100) / 100 })),
  ]
}
