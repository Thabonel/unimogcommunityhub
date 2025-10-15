CREATE OR REPLACE VIEW signup_health_check AS
SELECT
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as signups_last_hour,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '6 hours') as signups_last_6h,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as signups_last_24h,
    MAX(created_at) as last_signup_time,
    EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 as hours_since_last_signup,
    CASE
        WHEN MAX(created_at) IS NULL THEN 'CRITICAL'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 12 THEN 'CRITICAL'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 6 THEN 'WARNING'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 2 THEN 'NOTICE'
        ELSE 'OK'
    END as health_status,
    CASE
        WHEN MAX(created_at) IS NULL THEN 'NO SIGNUPS EVER - Check auth system immediately'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 12 THEN 'No signups in 12+ hours - Possible signup failure'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 6 THEN 'No signups in 6+ hours - Monitor closely'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 2 THEN 'No signups in 2+ hours'
        ELSE 'Recent signup activity'
    END as status_message
FROM auth.users;

CREATE TABLE IF NOT EXISTS signup_health_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    check_time timestamptz DEFAULT NOW(),
    health_status text NOT NULL,
    signups_last_hour int,
    signups_last_6h int,
    signups_last_24h int,
    hours_since_last_signup numeric,
    alert_sent boolean DEFAULT false,
    created_at timestamptz DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signup_health_log_check_time ON signup_health_log(check_time DESC);
CREATE INDEX IF NOT EXISTS idx_signup_health_log_status ON signup_health_log(health_status);

CREATE OR REPLACE FUNCTION check_signup_health()
RETURNS TABLE(
    status text,
    message text,
    should_alert boolean,
    details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_health_status text;
    v_status_message text;
    v_signups_1h int;
    v_signups_6h int;
    v_signups_24h int;
    v_hours_since numeric;
    v_should_alert boolean := false;
    v_last_alert_time timestamptz;
BEGIN
    SELECT
        h.health_status,
        h.status_message,
        h.signups_last_hour,
        h.signups_last_6h,
        h.signups_last_24h,
        h.hours_since_last_signup
    INTO
        v_health_status,
        v_status_message,
        v_signups_1h,
        v_signups_6h,
        v_signups_24h,
        v_hours_since
    FROM signup_health_check h;

    SELECT MAX(check_time) INTO v_last_alert_time
    FROM signup_health_log
    WHERE alert_sent = true AND health_status IN ('CRITICAL', 'WARNING');

    v_should_alert := (
        v_health_status IN ('CRITICAL', 'WARNING')
        AND (
            v_last_alert_time IS NULL
            OR v_last_alert_time < NOW() - INTERVAL '1 hour'
        )
    );

    INSERT INTO signup_health_log (
        health_status,
        signups_last_hour,
        signups_last_6h,
        signups_last_24h,
        hours_since_last_signup,
        alert_sent
    ) VALUES (
        v_health_status,
        v_signups_1h,
        v_signups_6h,
        v_signups_24h,
        v_hours_since,
        v_should_alert
    );

    RETURN QUERY SELECT
        v_health_status,
        v_status_message,
        v_should_alert,
        jsonb_build_object(
            'signups_last_hour', v_signups_1h,
            'signups_last_6h', v_signups_6h,
            'signups_last_24h', v_signups_24h,
            'hours_since_last_signup', v_hours_since
        );
END;
$$;

CREATE OR REPLACE FUNCTION send_signup_alert()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_health_status text;
    v_status_message text;
    v_should_alert boolean;
    v_details jsonb;
BEGIN
    SELECT status, message, should_alert, details
    INTO v_health_status, v_status_message, v_should_alert, v_details
    FROM check_signup_health();

    IF v_should_alert THEN
        PERFORM queue_admin_email(
            'error',
            gen_random_uuid(),
            'ALERT: Signup System Health - ' || v_health_status,
            'Signup Health Alert' || E'\n\n' ||
            'Status: ' || v_health_status || E'\n' ||
            'Message: ' || v_status_message || E'\n\n' ||
            'Details:' || E'\n' ||
            '- Signups last hour: ' || (v_details->>'signups_last_hour') || E'\n' ||
            '- Signups last 6 hours: ' || (v_details->>'signups_last_6h') || E'\n' ||
            '- Signups last 24 hours: ' || (v_details->>'signups_last_24h') || E'\n' ||
            '- Hours since last signup: ' || (v_details->>'hours_since_last_signup') || E'\n\n' ||
            'Action Required: Check signup system immediately' || E'\n' ||
            'Admin Panel: https://unimogcommunityhub.com/admin' || E'\n' ||
            'Database: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor'
        );
    END IF;
END;
$$;
