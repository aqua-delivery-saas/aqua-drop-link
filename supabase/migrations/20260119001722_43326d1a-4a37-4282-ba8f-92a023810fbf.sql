-- Populate expires_at for existing subscriptions with NULL values
-- Monthly subscriptions: expires_at = started_at + 1 month
UPDATE subscriptions 
SET 
  expires_at = started_at + interval '1 month',
  updated_at = now()
WHERE expires_at IS NULL 
  AND started_at IS NOT NULL
  AND plan = 'monthly';

-- Annual subscriptions: expires_at = started_at + 1 year
UPDATE subscriptions 
SET 
  expires_at = started_at + interval '1 year',
  updated_at = now()
WHERE expires_at IS NULL 
  AND started_at IS NOT NULL
  AND plan = 'annual';