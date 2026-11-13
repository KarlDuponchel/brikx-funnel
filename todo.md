# Todo

## Immédiat
- ~~Cron de rappel pour les leads à venir : 24h avant envoyer un mail au client avec rappel date + horaire~~
- ~~Cron de synchro des leads dans un fichier Google Sheets + CSV à envoyer par mail~~
- Cron de synchro des leads dans Google Sheets (à implémenter)

## Prérequis Dokploy / Supabase (à configurer avant le déploiement)

### Variables d'environnement (Dokploy)
| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |
| `RESEND_API_KEY` | Clé API Resend |
| `RESEND_FROM_EMAIL` | Expéditeur de tous les e-mails, obligatoire (ex : `Brikx Consulting <noreply@brikx.fr>`) |
| `RESEND_REPLY_TO` | Adresse de réponse des e-mails envoyés aux leads (optionnel) |
| `NEXT_PUBLIC_CALENDLY_URL` | URL du calendrier Calendly |
| `CALENDLY_PERSONAL_ACCESS_TOKEN` | Token API Calendly |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clé site Turnstile (créer sur dash.cloudflare.com/turnstile) |
| `TURNSTILE_SECRET_KEY` | Clé secrète Turnstile |
| `LEAD_TOKEN_SECRET` | Chaîne aléatoire 32+ chars (ex : `openssl rand -hex 32`) |
| `CRON_SECRET` | Chaîne aléatoire pour protéger les routes cron (ex : `openssl rand -hex 32`) |
| `LEADS_EXPORT_EMAIL` | Destinataire(s) du CSV quotidien, obligatoire. Plusieurs adresses séparées par des virgules |
| `QUESTIONNAIRE_RECAP_EMAIL` | Destinataire(s) du récap questionnaire quotidien (un seul e-mail pour tous les RDV des 24 h), obligatoire pour ce cron. Plusieurs adresses séparées par des virgules |
| `NEXT_PUBLIC_APP_URL` | URL publique du site (`https://funnel.brikxconsulting.com`) |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Ex : `https://umami.mondomaine.fr/script.js` (optionnel) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | ID du site dans Umami (optionnel) |

> Les variables `NEXT_PUBLIC_*` sont injectées au build : redéployer après les avoir modifiées.

### Cloudflare Turnstile
1. Créer un widget sur https://dash.cloudflare.com/turnstile
2. Ajouter les hostnames : `funnel.brikxconsulting.com`, `localhost`, et le domaine temporaire Dokploy (`*.traefik.me`)
3. Récupérer la site key et la secret key → les ajouter dans Dokploy

### Crons
Le site est hébergé sur Dokploy : les crons sont des **Schedules** de l'application (onglet Schedules de l'app, timezone UTC, Shell Type **Sh** — l'image Alpine n'a pas `bash`).
La commande s'exécute dans le conteneur et passe par `scripts/cron.mjs`, qui lit `CRON_SECRET` dans l'environnement de l'app :

```sh
node scripts/cron.mjs <route>
```

| Schedule | Cron (UTC) | Route |
|---|---|---|
| Récap questionnaire | `0 6 * * *` | `questionnaire-recap` — **une seule fois par jour** : couvre les RDV des 24 h suivantes, un déclenchement plus fréquent enverrait des doublons |
| Rappel email | `0 7 * * *` | `reminder` |
| Export CSV | `0 8 * * *` | `leads-export` |

Appel avec l'en-tête `Authorization: Bearer <CRON_SECRET>`. Sans `CRON_SECRET`, les routes sont publiques.
