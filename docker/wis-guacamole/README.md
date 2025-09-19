# WIS Remote Desktop System - Apache Guacamole

This directory contains the complete Apache Guacamole deployment for the Unimog Community Hub WIS (Workshop Information System) remote desktop access.

## Quick Start

1. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Deploy Infrastructure**:
   ```bash
   ./deploy.sh
   ```

3. **Apply Database Migration** (from project root):
   ```bash
   supabase migration up --include-name activate_wis_production_server
   ```

4. **Set Up Windows Server**:
   ```powershell
   # On Windows server, run as Administrator:
   .\scripts\wis-windows-server-setup.ps1
   ```

5. **Test Deployment**:
   ```bash
   # From project root:
   ./scripts/wis-session-test.js
   ```

## Architecture

```
Internet → Nginx (SSL) → Guacamole → RDP → Windows WIS Server
              ↓
         PostgreSQL
              ↓
       Cleanup Service
```

## Services

### Core Services
- **nginx**: SSL termination, load balancing, security headers
- **guacamole**: Web-based remote desktop gateway
- **guacd**: Guacamole proxy daemon
- **guacamole-db**: PostgreSQL database for sessions/users
- **cleanup-service**: Session monitoring and cleanup

### Ports
- **80**: HTTP (redirects to HTTPS)
- **443**: HTTPS (Nginx reverse proxy)
- **3389**: RDP (internal to Windows server)
- **8080**: Guacamole (internal only)

## Configuration

### Environment Variables (.env)
```bash
GUACAMOLE_DB_PASSWORD=secure_password_here
SSL_CERT_PATH=wis.unimogcommunityhub.com.crt
SSL_KEY_PATH=wis.unimogcommunityhub.com.key
WIS_DOMAIN=wis.unimogcommunityhub.com
WIS_SERVER_HOST=wis-server.unimogcommunityhub.com
```

### SSL Certificates
Place SSL certificates in `nginx/ssl/`:
- `wis.unimogcommunityhub.com.crt`
- `wis.unimogcommunityhub.com.key`

Self-signed certificates will be generated automatically if not provided.

## Management Commands

### Service Management
```bash
# Status check
docker-compose ps

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service]

# Restart specific service
docker-compose restart [service]
```

### Monitoring
```bash
# From project root:
./scripts/wis-monitor.sh status
./scripts/wis-monitor.sh resources
./scripts/wis-monitor.sh sessions
./scripts/wis-monitor.sh logs
./scripts/wis-monitor.sh diagnostic
```

### Maintenance
```bash
# Run maintenance tasks
./scripts/wis-monitor.sh maintenance

# Create backup
./scripts/wis-monitor.sh backup /path/to/backup

# Security check
./scripts/wis-monitor.sh security
```

## Windows Server Setup

### Requirements
- Windows Server 2019/2022 or Windows 10/11 Pro
- Mercedes WIS/EPC software installed
- Network connectivity to Guacamole server
- RDP enabled

### Setup Process
1. Run the PowerShell setup script as Administrator:
   ```powershell
   .\scripts\wis-windows-server-setup.ps1
   ```

2. Install Mercedes WIS/EPC software

3. Configure user accounts:
   - **WISPremium**: Premium subscription users
   - **WISLifetime**: Lifetime subscription users
   - **WISDemo**: Demo/trial users

4. Test RDP connectivity from Guacamole server

## Security Features

### SSL/TLS
- TLS 1.2/1.3 only
- Strong cipher suites
- HSTS enabled
- Security headers configured

### Access Control
- Rate limiting: 10 requests/minute per IP
- Session recording enabled
- Session timeouts: 30min idle, 4hr maximum
- IP whitelisting support

### Session Management
- Automatic session cleanup
- User isolation
- Audit trail maintained
- Resource monitoring

## Troubleshooting

### Common Issues

#### 1. Can't Connect to Guacamole
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs nginx guacamole
```

#### 2. RDP Connection Failed
```bash
# Test connectivity
telnet wis-server.unimogcommunityhub.com 3389

# Check Windows server
# On Windows: Get-Service TermService
```

#### 3. SSL Certificate Issues
```bash
# Regenerate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/wis.unimogcommunityhub.com.key \
  -out nginx/ssl/wis.unimogcommunityhub.com.crt
```

#### 4. Database Connection Issues
```bash
# Check database health
docker-compose exec guacamole-db pg_isready

# View database logs
docker-compose logs guacamole-db
```

### Log Locations
- **Application Logs**: `docker-compose logs [service]`
- **Nginx Logs**: Inside nginx container at `/var/log/nginx/`
- **Session Recordings**: `data/recordings/`
- **Database**: PostgreSQL logs via Docker

## Performance Optimization

### Resource Requirements (Minimum)
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **Network**: 100Mbps

### Scaling Options
1. **Vertical Scaling**: Increase server resources
2. **Horizontal Scaling**: Add more Windows servers
3. **Load Balancing**: Multiple Guacamole instances
4. **Database**: External PostgreSQL cluster

## Integration with Unimog Community Hub

### User Flow
1. User navigates to WIS in Community Hub
2. Premium subscription verified
3. WIS session created via API
4. User redirected to Guacamole interface
5. Remote desktop connection established
6. Session monitored and cleaned up

### API Endpoints
- **Session Management**: `/guacamole/api/session/`
- **Connection Status**: `/guacamole/api/connections/`
- **User Management**: `/guacamole/api/users/`

## Backup & Recovery

### Automated Backups
- **Database**: Daily PostgreSQL dumps
- **Configuration**: Docker Compose files
- **SSL Certificates**: Nginx SSL directory
- **Session Recordings**: Optional archival

### Manual Backup
```bash
./scripts/wis-monitor.sh backup /backup/location
```

### Disaster Recovery
1. Restore from backup
2. Update DNS if needed
3. Verify SSL certificates
4. Test all connections

## Monitoring & Alerts

### Health Checks
- **Nginx**: `/health` endpoint
- **Guacamole**: Web interface accessibility
- **Database**: Connection health
- **Windows Server**: RDP port connectivity

### Metrics
- Active session count
- Resource utilization
- Connection success rate
- Session duration statistics

### Alerting
Configure monitoring tools to alert on:
- Service downtime
- High resource usage
- Failed connections
- SSL certificate expiry

## Support

### Documentation
- **Full Guide**: `/docs/WIS_DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: This README
- **Scripts**: `/scripts/wis-*.{sh,js,ps1}`

### Logs and Diagnostics
```bash
# Full diagnostic report
./scripts/wis-monitor.sh diagnostic

# Specific service logs
docker-compose logs -f [service-name]
```

## Production Checklist

Before enabling user access:

- [ ] SSL certificates installed and valid
- [ ] Windows server configured with WIS software
- [ ] RDP connectivity tested
- [ ] Database migration applied
- [ ] Session cleanup service running
- [ ] Monitoring scripts working
- [ ] Backup system configured
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] User acceptance testing passed

---

**Status**: Ready for production deployment
**Last Updated**: January 2025