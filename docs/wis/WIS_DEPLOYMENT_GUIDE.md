# WIS System Deployment Guide

## Overview

This guide covers the complete deployment of the WIS (Workshop Information System) remote desktop infrastructure using Apache Guacamole.

## Architecture

```
Users → Nginx (SSL) → Guacamole → RDP → Windows WIS Server
                    ↓
               PostgreSQL DB
                    ↓
              Cleanup Service
```

## Prerequisites

### Infrastructure Requirements
- **Production Server**: 4+ CPU cores, 8GB+ RAM, 100GB+ storage
- **Windows VM/Server**: For Mercedes WIS/EPC software
- **Domain**: `wis.unimogcommunityhub.com` (configured in DNS)
- **SSL Certificate**: For HTTPS access
- **Docker & Docker Compose**: Installed on production server

### Software Requirements
- Mercedes WIS/EPC software installed on Windows server
- RDP enabled and configured on Windows server
- Network connectivity between Guacamole and Windows server

## Deployment Steps

### 1. Database Migration

Apply the WIS server configuration migration:

```bash
cd /Users/thabonel/Code/unimogcommunityhub
supabase migration up --include-name activate_wis_production_server
```

### 2. Deploy Guacamole Infrastructure

```bash
cd docker/wis-guacamole

# Copy and configure environment
cp .env.example .env
# Edit .env with your production values

# Deploy infrastructure
./deploy.sh
```

### 3. Configure Windows WIS Server

#### Windows Server Setup:
1. **Install Mercedes WIS/EPC software**
2. **Enable RDP**:
   ```powershell
   Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -name "fDenyTSConnections" -Value 0
   Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
   ```
3. **Create WIS user accounts** for each subscription tier
4. **Configure automatic login** for seamless user experience
5. **Disable Windows updates** during work hours
6. **Install remote desktop security patches**

#### Network Configuration:
- Ensure Windows server is accessible from Guacamole container
- Configure firewall to allow RDP traffic from Guacamole network
- Set static IP or reliable DNS for Windows server

### 4. Test Deployment

#### Health Checks:
```bash
# Check service status
docker-compose ps

# Test web interface
curl -k https://wis.unimogcommunityhub.com/health

# View logs
docker-compose logs -f guacamole
```

#### Connection Test:
1. Navigate to `https://wis.unimogcommunityhub.com/guacamole/`
2. Login with admin credentials
3. Test RDP connection to Windows server
4. Verify Mercedes WIS/EPC software launches correctly

## Security Hardening

### SSL/TLS Configuration
- Use Let's Encrypt or commercial SSL certificate
- Configure HSTS and security headers
- Disable weak cipher suites

### Access Control
- **Rate limiting**: 10 requests/minute per IP
- **Session recording**: All sessions recorded for audit
- **Session timeouts**: 4-hour maximum, 30-minute idle timeout
- **IP whitelisting**: Consider for high-security environments

### User Authentication
Integration with Supabase authentication:
1. Premium users automatically get WIS access
2. Session limits enforced based on subscription tier
3. Audit trail maintained in both Guacamole and Supabase

## Monitoring & Maintenance

### Service Monitoring
```bash
# View active sessions
docker-compose exec guacamole-db psql -U guacamole_user -d guacamole_db \
  -c "SELECT username, connection_name, start_date FROM guacamole_connection_history WHERE end_date IS NULL;"

# Check resource usage
docker stats

# View cleanup service logs
docker-compose logs cleanup-service
```

### Regular Maintenance
- **Weekly**: Review session recordings and logs
- **Monthly**: Update Docker images and security patches
- **Quarterly**: Review user access and permissions

## Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check Windows RDP service
docker-compose exec guacamole telnet wis-server.unimogcommunityhub.com 3389
```

#### 2. SSL Certificate Issues
```bash
# Regenerate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/wis.unimogcommunityhub.com.key \
  -out nginx/ssl/wis.unimogcommunityhub.com.crt
```

#### 3. Database Connection Issues
```bash
# Check database health
docker-compose exec guacamole-db pg_isready
```

### Log Locations
- **Guacamole**: `docker-compose logs guacamole`
- **Nginx**: `/var/log/nginx/` (inside container)
- **Cleanup Service**: `docker-compose logs cleanup-service`
- **Session Recordings**: `data/recordings/`

## Performance Optimization

### Resource Allocation
- **Guacamole**: 2GB RAM minimum
- **Database**: 1GB RAM minimum
- **Nginx**: 512MB RAM minimum
- **Windows Server**: 4GB+ RAM recommended

### Scaling
- Add additional Windows servers for load distribution
- Configure Guacamole connection load balancing
- Monitor concurrent session limits

## Integration with Unimog Community Hub

### Frontend Integration
The existing WIS React components will connect to:
- **Session API**: `https://wis.unimogcommunityhub.com/guacamole/api/`
- **WebSocket**: `wss://wis.unimogcommunityhub.com/guacamole/websocket-tunnel`

### User Flow
1. User navigates to WIS system in Community Hub
2. Subscription validation occurs (Premium/Lifetime only)
3. Session created via Guacamole API
4. User redirected to remote desktop interface
5. Session monitored and cleaned up automatically

## Success Metrics

✅ **Deployment Complete When**:
- [ ] Guacamole web interface accessible via HTTPS
- [ ] RDP connection to Windows server successful
- [ ] Mercedes WIS/EPC software launches in remote session
- [ ] Session cleanup service running
- [ ] SSL certificate valid and secure
- [ ] Premium users can access WIS through Community Hub
- [ ] Session recordings working
- [ ] Resource usage within acceptable limits

## Support & Maintenance

### Emergency Contacts
- **Infrastructure Issues**: Check Docker logs first
- **WIS Software Issues**: Restart Windows server RDP service
- **Security Concerns**: Review session recordings and access logs

### Backup & Recovery
- **Database**: Automated daily backups via PostgreSQL
- **Configuration**: All configs stored in Git repository
- **Session Recordings**: Regular archive to long-term storage

---

**Status**: Infrastructure deployed, requires Windows server configuration and testing.