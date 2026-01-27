-- Schedule Amazon Shop Updates
-- Automatically syncs prices and availability every morning (and throughout the day)

-- 1. Scrape Prices (No API) - Every 6 hours
-- Batch size 8, 119 products total -> needs ~15 runs for a full cycle
-- Running every 6 hours completes a cycle every 3-4 days
SELECT cron.schedule(
  'amazon-scrape-prices',
  '0 */6 * * *', -- At minute 0 of every 6th hour
  $$
    SELECT net.http_post(
      url := current_setting('app.settings.edge_function_url', true) || '/scrape-amazon-prices',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := '{}'::jsonb
    );
  $$
);

-- 2. Check Availability (PA-API) - Every 6 hours
-- Faster than scraping, checks in batches of 50
SELECT cron.schedule(
  'amazon-check-availability',
  '30 */6 * * *', -- At minute 30 of every 6th hour
  $$
    SELECT net.http_post(
      url := current_setting('app.settings.edge_function_url', true) || '/check-product-availability',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := '{}'::jsonb
    );
  $$
);

-- 3. Check Prices (PA-API) - Daily at 4 AM
-- Official API check for accurate pricing
SELECT cron.schedule(
  'amazon-check-prices-api',
  '0 4 * * *', -- Every day at 4:00 AM
  $$
    SELECT net.http_post(
      url := current_setting('app.settings.edge_function_url', true) || '/check-product-prices',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := '{}'::jsonb
    );
  $$
);
