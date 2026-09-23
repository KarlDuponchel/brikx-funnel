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
      "Nous tenons un commerce avec mon mari depuis plus de 14 ans.\nComme beaucoup de femme d'entrepeneur je devais gérer beaucoup de choses à la fois endossant plusieurs casquettes mais sans jamais réellement trouver ma place.\nCroulant sous la surcharge mentale, physique (stress, gestion du personnel, admistratif et comptable) j'ai fait appel à Brikx.\nJ'ai pu bénéficier d'un accompagnement et d'un coaching afin de reprendre ma vie en main.\nJ'ai enfin pu trouver ma place au sein de mon entreprise, à gérer mon temps aussi bien professionnel que personnel et gérer mes priorités.\nCela m'a apporté une meilleure confiance en moi, un apaisement aussi bien au travail que dans ma relation avec mon mari.\nEt une belle rencontre avec Gaelle et Anaïs.\nMerciiii mille fois à vous.",
    name: "Magali",
    role: "Gérant d'un commerce",
    initials: "M",
  },
  {
    quote:
      "Gérant en couple d'une entreprise employant 8 salariés nous avons fait appel à Brikx pour un coaching car nous traversions une période de surcharge mentale, de doute, fatigue et remise en question ce qui faillit nous mener au burnout.\nLeur approche dans le management, prise de décision, prise de recul, cohésion et harmonie du couple nous ont permis de retrouver une belle énergie, un management positif et structuré, ce qui nous a apporté beaucoup de sérénités MERCI BRIKS.",
    name: "Maxime",
    role: "Associée dirigeant",
    initials: "M",
  },
  {
    quote:
      "Ce n'est pas du coaching classique. C'est une remise à plat de ma posture, avec une rigueur scientifique que je n'avais jamais rencontrée ailleurs.",
    name: "A. Renaud",
    role: "Président · ETI technologique",
    initials: "AR",
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
