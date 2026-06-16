-- ============================================================
-- VISUALIZADOR DE EVOLUCIÓN EMBRIONARIA — Schema MVP
-- ============================================================
-- IMPORTANTE: RLS está deshabilitado para este MVP.
-- NO usar con datos reales de pacientes hasta que
-- Auth + RLS estén correctamente configurados.
-- ============================================================

CREATE TABLE embryo_cases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ DEFAULT now(),
  status              TEXT DEFAULT 'draft',
  patient_name        TEXT,
  patient_age         INTEGER,
  doctor_name         TEXT,
  procedure_date      DATE,
  procedure_type      TEXT,
  biologist_name      TEXT,
  oocytes             JSONB,
  fertilization       JSONB,
  embryos             JSONB,
  final_result        JSONB,
  ai_explanation      JSONB,
  edited_explanation  JSONB
);

-- Enable RLS but keep permissive for MVP (requires Auth setup to restrict):
-- ALTER TABLE embryo_cases ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all for now" ON embryo_cases FOR ALL USING (true);
