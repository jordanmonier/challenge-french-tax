import React, { useState, useMemo, useCallback } from 'react'
import './styles.css'

import getFamilyQuotient from './utils/getFamilyQuotient'
import getTax from './utils/getTax'

// CONFIGS
const DEFAULT_VALUES: IValues = {
  gross_income: 32000,
  state: 'single',
  children: 0,
  children_cmi: 0,
}

// TYPES
declare global {
  interface IValues {
    gross_income: number
    state: 'single' | 'married'
    children: number
    children_cmi: number
  }
}

// FUNCTIONS
export function calculate(values: IValues) {
  // Récupère le quotient familial
  let family_quotient = getFamilyQuotient(values)

  // Récupère l'impôts ainsi que les tranches
  let [tax, taxSlices] = getTax(values, family_quotient)

  return {
    family_quotient,
    tax,
    taxSlices,
    net_income: values.gross_income - tax,
  }
}

// EXPORTS
export default function App() {
  // VALUES
  // On stocke les données dans un 'State'
  const [values, setValues] = useState<IValues>(DEFAULT_VALUES)

  // HANDLE CHANGE
  // Applique les valeurs au state lorsque l'utilisateur change les valeurs
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value, type, name } = e.currentTarget

      setValues((prevValues) => ({
        ...prevValues,
        [name]: type === 'number' ? Number(value) : value,
      }))
    },
    []
  )

  // RESULT
  // Recalcule le résultat lorsque les valeurs changent
  const result = useMemo<ReturnType<typeof calculate>>(
    () => calculate(values),
    [values]
  )

  // RETURN
  return (
    <div className="App p-5">
      <div className="card">
        <div className="card-header">Calcul de l'impôt sur le revenu</div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label htmlFor="inputGrossIncome">Revenu brut</label>
              <input
                className="form-control"
                id="inputGrossIncome"
                type="number"
                name="gross_income"
                min={0}
                value={values.gross_income}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-5">
              <label htmlFor="inputState">État civil</label>
              <select
                className="form-control"
                id="inputState"
                name="state"
                value={values.state}
                onChange={handleChange}
              >
                <option value="single">Célibataire, divorcé ou veuf</option>
                <option value="married">Couple marié ou pacsé</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="inputChildren">Nombre d'enfants</label>
              <input
                className="form-control"
                id="inputChildren"
                type="number"
                name="children"
                min={0}
                value={values.children}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputChildrenCMI">
                Nombre d'enfants titulaires de la carte mobilité inclusion (CMI)
                mention invalidité
              </label>
              <input
                className="form-control"
                id="inputChildrenCMI"
                type="number"
                name="children_cmi"
                min={0}
                max={values.children}
                value={
                  values.children_cmi < values.children
                    ? values.children_cmi
                    : values.children
                }
                disabled={values.children === 0}
                onChange={handleChange}
              />
              <small>
                Ils doivent être aussi compris dans le champ "Nombre d'enfants"
              </small>
            </div>
            <hr className="mt-5" />
            <h5 className="mt-4">Résultats</h5>
            <div className="form-group">
              <label htmlFor="inputFamilyQuotient">Quotient familial</label>
              <input
                className="form-control"
                id="inputFamilyQuotient"
                type="text"
                disabled
                value={result.family_quotient.toLocaleString()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputTax">Impôt</label>
              <input
                className="form-control"
                id="inputTax"
                type="text"
                disabled
                value={result.tax.toLocaleString()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputNetIncome">Revenu net</label>
              <input
                className="form-control"
                id="inputNetIncome"
                type="numbtexter"
                disabled
                value={result.net_income.toLocaleString()}
              />
            </div>
            <h5 className="mt-4">Tranches d'impositions</h5>
            <table className="table table-bordered mt-3">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Début de la tranche</th>
                  <th scope="col">Fin de la tranche</th>
                  <th scope="col">Montant imposé</th>
                </tr>
              </thead>
              <tbody>
                {result.taxSlices.map((e, i) => (
                  <tr key={e.from}>
                    <th scope="row">{i + 1}</th>
                    <th>{e.from.toLocaleString()}</th>
                    <th>{e.to.toLocaleString()}</th>
                    <th>
                      {e.value.toLocaleString()}
                      {e.value > 0 &&
                        result.family_quotient > 1 &&
                        ` (x${result.family_quotient.toLocaleString()})`}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  )
}
