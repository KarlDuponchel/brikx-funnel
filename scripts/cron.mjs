// Déclenche une route cron depuis le conteneur (Schedules Dokploy).
// Usage : node scripts/cron.mjs <route>   ex : node scripts/cron.mjs questionnaire-recap
// Sans guillemets ni variables shell : la commande ne dépend pas de l'échappement fait par Dokploy.

const route = process.argv[2] ?? "";
if (!/^[a-z-]+$/.test(route)) {
  console.error("Usage : node scripts/cron.mjs <route>");
  process.exit(1);
}

const port = process.env.PORT || 3000;
const res = await fetch(`http://127.0.0.1:${port}/api/cron/${route}`, {
  headers: { Authorization: `Bearer ${process.env.CRON_SECRET ?? ""}` },
});

console.log(res.status, await res.text());
if (!res.ok) process.exit(1);
