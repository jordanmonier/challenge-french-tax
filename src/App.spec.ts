import { calculate } from './App'

test('32000, célibataire, aucun enfant', () => {
  expect(
    calculate({
      gross_income: 32000,
      state: 'single',
      children: 0,
      children_cmi: 0,
    })
  ).toMatchObject({
    tax: 3617.34,
  })
})

test('55950, marié, 2 enfants', () => {
  expect(
    calculate({
      gross_income: 55950,
      state: 'married',
      children: 2,
      children_cmi: 0,
    })
  ).toMatchObject({
    tax: 2833.05,
  })
})
