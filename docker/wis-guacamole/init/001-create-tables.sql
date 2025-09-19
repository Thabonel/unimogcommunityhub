--
-- Guacamole Database Initialization
-- Create tables required for Guacamole authentication and connection management
--

-- Connection groups
CREATE TABLE IF NOT EXISTS guacamole_connection_group (
    connection_group_id SERIAL NOT NULL,
    parent_id INTEGER,
    connection_group_name VARCHAR(128) NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'ORGANIZATIONAL',
    max_connections INTEGER,
    max_connections_per_user INTEGER,
    enable_session_affinity BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (connection_group_id),
    UNIQUE (connection_group_name, parent_id)
);

-- Connections
CREATE TABLE IF NOT EXISTS guacamole_connection (
    connection_id SERIAL NOT NULL,
    connection_name VARCHAR(128) NOT NULL,
    parent_id INTEGER,
    protocol VARCHAR(32) NOT NULL,
    max_connections INTEGER,
    max_connections_per_user INTEGER,
    connection_weight INTEGER,
    failover_only BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (connection_id),
    UNIQUE (connection_name, parent_id)
);

-- Connection parameters
CREATE TABLE IF NOT EXISTS guacamole_connection_parameter (
    connection_id INTEGER NOT NULL,
    parameter_name VARCHAR(128) NOT NULL,
    parameter_value VARCHAR(4096),
    PRIMARY KEY (connection_id, parameter_name)
);

-- Users
CREATE TABLE IF NOT EXISTS guacamole_entity (
    entity_id SERIAL NOT NULL,
    name VARCHAR(128) NOT NULL,
    type VARCHAR(16) NOT NULL,
    PRIMARY KEY (entity_id),
    UNIQUE (type, name)
);

CREATE TABLE IF NOT EXISTS guacamole_user (
    user_id INTEGER NOT NULL,
    password_hash BYTEA NOT NULL,
    password_salt BYTEA,
    password_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    disabled BOOLEAN NOT NULL DEFAULT FALSE,
    expired BOOLEAN NOT NULL DEFAULT FALSE,
    access_window_start TIME,
    access_window_end TIME,
    valid_from DATE,
    valid_until DATE,
    timezone VARCHAR(64),
    full_name VARCHAR(256),
    email_address VARCHAR(256),
    organization VARCHAR(256),
    organizational_role VARCHAR(256),
    PRIMARY KEY (user_id)
);

-- User permissions
CREATE TABLE IF NOT EXISTS guacamole_user_permission (
    entity_id INTEGER NOT NULL,
    affected_user_id INTEGER NOT NULL,
    permission VARCHAR(16) NOT NULL,
    PRIMARY KEY (entity_id, affected_user_id, permission)
);

-- Connection permissions
CREATE TABLE IF NOT EXISTS guacamole_connection_permission (
    entity_id INTEGER NOT NULL,
    connection_id INTEGER NOT NULL,
    permission VARCHAR(16) NOT NULL,
    PRIMARY KEY (entity_id, connection_id, permission)
);

-- Connection group permissions
CREATE TABLE IF NOT EXISTS guacamole_connection_group_permission (
    entity_id INTEGER NOT NULL,
    connection_group_id INTEGER NOT NULL,
    permission VARCHAR(16) NOT NULL,
    PRIMARY KEY (entity_id, connection_group_id, permission)
);

-- Active connection sessions
CREATE TABLE IF NOT EXISTS guacamole_connection_history (
    history_id SERIAL NOT NULL,
    user_id INTEGER,
    username VARCHAR(128) NOT NULL,
    remote_host VARCHAR(256),
    connection_id INTEGER,
    connection_name VARCHAR(128) NOT NULL,
    sharing_profile_id INTEGER,
    sharing_profile_name VARCHAR(128),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (history_id)
);

-- User groups (for WIS subscription tiers)
CREATE TABLE IF NOT EXISTS guacamole_user_group (
    user_group_id INTEGER NOT NULL,
    disabled BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_group_id)
);

-- User group membership
CREATE TABLE IF NOT EXISTS guacamole_user_group_member (
    user_group_id INTEGER NOT NULL,
    member_entity_id INTEGER NOT NULL,
    PRIMARY KEY (user_group_id, member_entity_id)
);

-- Insert WIS connection configuration
INSERT INTO guacamole_connection_group (connection_group_name, type)
VALUES ('WIS Servers', 'ORGANIZATIONAL') ON CONFLICT (connection_group_name, parent_id) DO NOTHING;

-- Create WIS connection template
INSERT INTO guacamole_connection (connection_name, parent_id, protocol, max_connections, max_connections_per_user)
VALUES ('Mercedes WIS/EPC',
        (SELECT connection_group_id FROM guacamole_connection_group WHERE connection_group_name = 'WIS Servers'),
        'rdp', 10, 1) ON CONFLICT (connection_name, parent_id) DO NOTHING;

-- Set RDP connection parameters for WIS
INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'hostname', 'wis-server.unimogcommunityhub.com'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'port', '3389'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'security', 'tls'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'ignore-cert', 'true'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'enable-wallpaper', 'false'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'enable-theming', 'false'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'enable-font-smoothing', 'true'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

-- Enable session recording
INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'recording-path', '/var/lib/guacamole/recordings'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
SELECT c.connection_id, 'create-recording-path', 'true'
FROM guacamole_connection c WHERE c.connection_name = 'Mercedes WIS/EPC'
ON CONFLICT (connection_id, parameter_name) DO NOTHING;