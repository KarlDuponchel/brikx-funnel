CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  calendly_event_uri TEXT,
  booking_date TEXT,
  booking_time TEXT,
  domaine_activite TEXT,
  entreprise TEXT,
  defi TEXT,
  motivation INTEGER CHECK (motivation >= 1 AND motivation <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);
