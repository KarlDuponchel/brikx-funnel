# Todo

## Immédiat
- ~~Cron de rappel pour les leads à venir : 24h avant envoyer un mail au client avec rappel date + horaire~~
- ~~Cron de synchro des leads dans un fichier Google Sheets + CSV à envoyer par mail~~
- Cron de synchro des leads dans Google Sheets (à implémenter)

## Prérequis Vercel / Supabase (à configurer avant le déploiement)

### Variables d'environnement Vercel
| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |
| `RESEND_API_KEY` | Clé API Resend |
| `RESEND_FROM_EMAIL` | Ex : `Brikx Consulting <noreply@brikx.fr>` |
| `NEXT_PUBLIC_CALENDLY_URL` | URL du calendrier Calendly |
| `CALENDLY_PERSONAL_ACCESS_TOKEN` | Token API Calendly |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clé site Turnstile (créer sur dash.cloudflare.com/turnstile) |
| `TURNSTILE_SECRET_KEY` | Clé secrète Turnstile |
| `LEAD_TOKEN_SECRET` | Chaîne aléatoire 32+ chars (ex : `openssl rand -hex 32`) |
| `CRON_SECRET` | Chaîne aléatoire pour protéger les routes cron (ex : `openssl rand -hex 32`) |
| `LEADS_EXPORT_EMAIL` | Adresse de réception du CSV quotidien (`contact@karlduponchel.fr`) |

### Cloudflare Turnstile
1. Créer un widget sur https://dash.cloudflare.com/turnstile
2. Ajouter les hostnames : `go.brikx.fr`, `localhost`, et le sous-domaine Vercel temporaire
3. Récupérer la site key et la secret key → les ajouter dans Vercel

### Crons Vercel
Les crons sont configurés dans `vercel.json` et seront actifs automatiquement après déploiement :
- **Rappel email** : toutes les heures (`/api/cron/reminder`)
- **Export CSV** : tous les jours à 8h UTC (`/api/cron/leads-export`)

> Note : les crons Vercel nécessitent un plan Pro ou supérieur pour les fréquences < 1 jour.