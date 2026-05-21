export const STATS = [
  { value: "+200", label: "Dirigeants accompagnés" },
  { value: "4.9", label: "Note moyenne" },
  { value: "4", label: "Associés experts" },
];

export const TRIPLE_PROJET = [
  {
    num: "01",
    name: "Projet Professionnel",
    desc: "Structurer une vision, déléguer intelligemment, piloter la croissance sans s'épuiser.",
  },
  {
    num: "02",
    name: "Projet Santé",
    desc: "Énergie, sommeil, récupération — les fondations biologiques de la performance durable.",
  },
  {
    num: "03",
    name: "Projet de Vie",
    desc: "Couple, famille, sens personnel — ce qui donne une raison de performer.",
  },
];

export const PAIN_POINTS = [
  "Travailler 60h/semaine sans voir de résultats proportionnels",
  "Sacrifier votre santé pour votre entreprise",
  "Ne plus avoir de temps pour votre vie personnelle",
  "Vous sentir seul face aux décisions stratégiques",
  "Enchaîner les formations sans changement durable",
  "Repousser votre bien-être à « quand j'aurai le temps »",
];

export const TESTIMONIALS = [
  {
    quote:
      "En 3 mois, j'ai retrouvé un équilibre que je pensais impossible. Mon entreprise tourne mieux, et moi aussi.",
    name: "Laurent M.",
    role: "CEO · Industrie",
    initials: "LM",
  },
  {
    quote:
      "L'approche Triple Projet a changé ma façon de diriger. Je suis plus lucide, plus présent, plus efficace.",
    name: "Sophie D.",
    role: "Fondatrice · Services B2B",
    initials: "SD",
  },
  {
    quote:
      "Je recommande à tous les dirigeants qui sentent qu'ils arrivent à un plafond — professionnel ou personnel.",
    name: "Marc T.",
    role: "DG · Retail",
    initials: "MT",
  },
];

export const FEATURES = [
  "+200 dirigeants accompagnés",
  "Fondé sur les neurosciences",
  "Sans engagement",
];

export const QUESTIONS = [
  {
    num: 1,
    total: 4,
    question: "Quel est votre\ndomaine d'activité ?",
    placeholder: "Ex : Industrie, Services B2B, Retail, Santé...",
    type: "input" as const,
    field: "domaineActivite" as const,
  },
  {
    num: 2,
    total: 4,
    question: "Quelle est votre\nentreprise ?",
    placeholder: "Nom de votre entreprise / structure",
    type: "input" as const,
    field: "entreprise" as const,
  },
  {
    num: 3,
    total: 4,
    question: "Quel défi vous amène\nà nous contacter ?",
    placeholder:
      "Décrivez brièvement la problématique principale que vous souhaitez adresser...",
    type: "textarea" as const,
    field: "defi" as const,
  },
  {
    num: 4,
    total: 4,
    question:
      "Sur une échelle de 1 à 10,\nà quel point êtes-vous\nmotivé à passer au\nniveau supérieur ?",
    placeholder: "",
    type: "rating" as const,
    field: "motivation" as const,
  },
];
