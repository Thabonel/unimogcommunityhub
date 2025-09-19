-- Migration: Activate WIS Production Server
-- Created: 2025-01-20
-- Purpose: Update WIS server configuration from maintenance to production-ready

-- Update WIS server to production-ready configuration
UPDATE wis_servers
SET status = 'active',
    host_url = 'wis-server.unimogcommunityhub.com:3389',
    guacamole_url = 'https://wis.unimogcommunityhub.com/guacamole',
    max_concurrent_sessions = 10,
    specs = jsonb_build_object(
        'environment', 'production',
        'ssl_enabled', true,
        'session_timeout', 3600,
        'max_session_duration', 14400,
        'connection_protocol', 'rdp',
        'security_mode', 'tls',
        'note', 'Production WIS server with Guacamole remote access',
        'updated', now()::text
    ),
    updated_at = now()
WHERE name = 'WIS EPC Development Server';

-- Update server name to reflect production status
UPDATE wis_servers
SET name = 'WIS EPC Production Server'
WHERE name = 'WIS EPC Development Server';

-- Insert additional WIS server for load balancing (optional)
INSERT INTO wis_servers (name, host_url, guacamole_url, max_concurrent_sessions, status, specs)
VALUES (
    'WIS EPC Backup Server',
    'wis-server-2.unimogcommunityhub.com:3389',
    'https://wis.unimogcommunityhub.com/guacamole',
    5,
    'standby',
    jsonb_build_object(
        'environment', 'production',
        'ssl_enabled', true,
        'session_timeout', 3600,
        'max_session_duration', 14400,
        'connection_protocol', 'rdp',
        'security_mode', 'tls',
        'role', 'backup',
        'note', 'Backup WIS server for high availability'
    )
) ON CONFLICT (name) DO NOTHING;