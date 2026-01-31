// Lista centralizada de categorias de comércio
const categoriasBase = [
  "Alimentação",
  "Vestuário",
  "Serviços",
  "Saúde",
  "Educação",
  "Beleza",
  "Tecnologia",
  "Automotivo",
  "Construção",
  "Pet Shop",
  "Esportes",
  "Lazer",
  "Móveis/Decoração",
  "Agropecuária",
  "Papelaria",
  "Supermercado",
  "Farmácia",
];

export const categoriasComercio = [
  ...categoriasBase.sort((a, b) => a.localeCompare(b, "pt-BR")),
  "Outro (especificar)",
];
