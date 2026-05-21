<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Orchestration du Workflow

### 1. Mode Plan par Défaut
- Entrer en mode plan pour TOUTE tâche non triviale (3+ étapes ou décisions d’architecture)
- Si quelque chose dérape, ARRÊTER et replanifier immédiatement — ne pas continuer coûte que coûte
- Utiliser le mode plan pour les étapes de vérification, pas seulement pour le développement
- Rédiger des spécifications détaillées en amont pour réduire les ambiguïtés

### 2. Stratégie de Sous-agents
- Utiliser largement les sous-agents pour garder le contexte principal propre
- Déléguer la recherche, l’exploration et l’analyse parallèle aux sous-agents
- Pour les problèmes complexes, allouer plus de calcul via les sous-agents
- Une tâche par sous-agent pour une exécution ciblée

### 3. Boucle d’Amélioration Continue
- Après TOUTE correction de l’utilisateur : mettre à jour `tasks/lessons.md` avec le schéma identifié
- Écrire des règles personnelles pour éviter de refaire la même erreur
- Itérer sans concession sur ces leçons jusqu’à réduire le taux d’erreurs
- Relire les leçons au début de chaque session pour le projet concerné

### 4. Vérification Avant Validation
- Ne jamais marquer une tâche comme terminée sans prouver qu’elle fonctionne
- Comparer le comportement entre la version principale et vos changements lorsque pertinent
- Se demander : « Est-ce qu’un staff engineer approuverait cela ? »
- Lancer les tests, vérifier les logs, démontrer la validité

### 5. Exiger l’Élégance (Équilibrée)
- Pour les changements non triviaux : faire une pause et se demander « existe-t-il une solution plus élégante ? »
- Si une correction semble bricolée : « Avec tout ce que je sais maintenant, implémenter la solution élégante »
- Ignorer ce point pour les corrections simples et évidentes — ne pas sur-concevoir
- Challenger son propre travail avant de le présenter

### 6. Correction de Bugs Autonome
- Lorsqu’un rapport de bug est fourni : le corriger directement. Ne pas demander d’accompagnement
- Identifier les logs, erreurs et tests en échec — puis les résoudre
- Aucun changement de contexte requis côté utilisateur
- Corriger les tests CI en échec sans instructions supplémentaires

## Principes Fondamentaux
- **Simplicité Avant Tout** : rendre chaque changement aussi simple que possible. Impact minimal sur le code.
- **Zéro Fainéantise** : trouver les causes racines. Pas de solutions temporaires. Standards de développeur senior.
- **Impact Minimal** : les changements ne doivent toucher que le strict nécessaire. Éviter d’introduire des bugs.
- **ACCENTS** : N'oublie pas les accents dans les phrases en français