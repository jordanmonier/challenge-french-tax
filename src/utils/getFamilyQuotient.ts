export default function getFamilyQuotient(values: IValues) {
  // Le quotient vaut 1 lorsque célibataire, divorcé ou veuf,
  // et 2 lorsque marrié ou pacsé
  let familyQuotient = values.state === 'single' ? 1 : 2

  // Le premier enfant vaut 0.5
  if (values.children >= 1) familyQuotient += 0.5
  // Le deuxième enfant vaut aussi 0.5
  if (values.children >= 2) familyQuotient += 0.5
  // Les autres valent toujours 1
  if (values.children >= 3) {
    for (let i = 3; i <= values.children; i++) {
      familyQuotient += 1
    }
  }

  // Si il y a des enfants titulaires de la carte mobilité inclusion (CMI) mention invalidité,
  // On ajoute 0.5 pour chacun d'entre-eux
  if (values.children_cmi > 0) {
    if (values.children_cmi > values.children)
      values.children_cmi = values.children

    familyQuotient += values.children_cmi * 0.5
  }

  return familyQuotient
}
