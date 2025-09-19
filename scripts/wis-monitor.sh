#!/bin/bash

# WIS System Monitoring and Management Script
# Provides monitoring, maintenance, and troubleshooting capabilities for the WIS system

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
WIS_DOCKER_DIR="$PROJECT_DIR/docker/wis-guacamole"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "INFO")  echo -e "${BLUE}[INFO]${NC}  [$timestamp] $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} [$timestamp] $message" ;;
        "WARNING") echo -e "${YELLOW}[WARNING]${NC} [$timestamp] $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} [$timestamp] $message" ;;
        "DEBUG") echo -e "${PURPLE}[DEBUG]${NC} [$timestamp] $message" ;;
        *) echo -e "${CYAN}[$level]${NC} [$timestamp] $message" ;;
    esac
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        log "ERROR" "Docker Compose is not installed or not in PATH"
        exit 1
    fi
}

# Show WIS system status
show_status() {
    log "INFO" "WIS System Status Check"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$WIS_DOCKER_DIR"

    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        log "SUCCESS" "WIS services are running"
        echo
        docker-compose ps
        echo

        # Check service health
        log "INFO" "Checking service health..."

        # Nginx health
        if curl -f -s -k "https://localhost/health" > /dev/null 2>&1; then
            log "SUCCESS" "Nginx proxy is healthy"
        else
            log "WARNING" "Nginx proxy health check failed"
        fi

        # Database health
        if docker-compose exec -T guacamole-db pg_isready -U guacamole_user -d guacamole_db > /dev/null 2>&1; then
            log "SUCCESS" "Database is healthy"
        else
            log "WARNING" "Database health check failed"
        fi

        # Guacamole health
        if curl -f -s -k "https://localhost/guacamole/" | grep -q "Guacamole" 2>/dev/null; then
            log "SUCCESS" "Guacamole web interface is accessible"
        else
            log "WARNING" "Guacamole web interface check failed"
        fi
    else
        log "WARNING" "WIS services are not running"
        docker-compose ps
    fi
}

# Show resource usage
show_resources() {
    log "INFO" "WIS Resource Usage"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$WIS_DOCKER_DIR"

    if docker-compose ps -q | head -1 | xargs docker inspect > /dev/null 2>&1; then
        echo
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" $(docker-compose ps -q)
        echo

        # Disk usage
        log "INFO" "Docker volume disk usage:"
        docker system df -v | grep wis 2>/dev/null || log "INFO" "No WIS-specific volumes found"
    else
        log "WARNING" "No WIS containers found"
    fi
}

# Show active sessions
show_sessions() {
    log "INFO" "Active WIS Sessions"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$WIS_DOCKER_DIR"

    if docker-compose ps | grep -q guacamole-db.*Up; then
        log "INFO" "Querying active sessions from database..."
        docker-compose exec -T guacamole-db psql -U guacamole_user -d guacamole_db -c "
            SELECT
                username,
                connection_name,
                start_date,
                EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_date))/60 as duration_minutes
            FROM guacamole_connection_history
            WHERE end_date IS NULL
            ORDER BY start_date DESC;
        " 2>/dev/null || log "WARNING" "Could not query session data"
    else
        log "WARNING" "Database is not running - cannot show sessions"
    fi
}

# Show recent logs
show_logs() {
    local service=${1:-"all"}
    local lines=${2:-50}

    log "INFO" "WIS Logs (last $lines lines)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$WIS_DOCKER_DIR"

    if [ "$service" = "all" ]; then
        docker-compose logs --tail=$lines
    else
        if docker-compose ps | grep -q "$service"; then
            docker-compose logs --tail=$lines "$service"
        else
            log "ERROR" "Service '$service' not found"
            log "INFO" "Available services: $(docker-compose ps --services | tr '\n' ' ')"
        fi
    fi
}

# Restart WIS services
restart_services() {
    log "INFO" "Restarting WIS services..."

    cd "$WIS_DOCKER_DIR"

    log "INFO" "Stopping services..."
    docker-compose down

    log "INFO" "Starting services..."
    docker-compose up -d

    sleep 10

    log "INFO" "Checking service status..."
    show_status
}

# Run maintenance tasks
run_maintenance() {
    log "INFO" "Running WIS maintenance tasks..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$WIS_DOCKER_DIR"

    # Clean up old session recordings (older than 30 days)
    log "INFO" "Cleaning up old session recordings..."
    if [ -d "data/recordings" ]; then
        find data/recordings -name "*.guac" -mtime +30 -delete 2>/dev/null || true
        log "SUCCESS" "Old recordings cleaned up"
    fi

    # Clean up Docker system
    log "INFO" "Cleaning up Docker system..."
    docker system prune -f > /dev/null 2>&1
    log "SUCCESS" "Docker cleanup completed"

    # Update container images
    log "INFO" "Checking for image updates..."
    docker-compose pull
    log "SUCCESS" "Container images updated"

    # Database maintenance
    if docker-compose ps | grep -q guacamole-db.*Up; then
        log "INFO" "Running database maintenance..."
        docker-compose exec -T guacamole-db psql -U guacamole_user -d guacamole_db -c "VACUUM ANALYZE;" > /dev/null 2>&1
        log "SUCCESS" "Database maintenance completed"
    fi
}

# Backup WIS data
backup_data() {
    local backup_dir="${1:-./backups}"
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="wis_backup_$timestamp.tar.gz"

    log "INFO" "Creating WIS backup..."

    cd "$WIS_DOCKER_DIR"

    # Create backup directory
    mkdir -p "$backup_dir"

    # Create backup
    log "INFO" "Backing up configuration and data..."
    tar -czf "$backup_dir/$backup_file" \
        .env \
        docker-compose.yml \
        nginx/ \
        data/ \
        2>/dev/null || log "WARNING" "Some files may not have been backed up"

    # Database backup
    if docker-compose ps | grep -q guacamole-db.*Up; then
        log "INFO" "Backing up database..."
        docker-compose exec -T guacamole-db pg_dump -U guacamole_user guacamole_db > "$backup_dir/db_backup_$timestamp.sql"
        log "SUCCESS" "Database backup completed"
    fi

    log "SUCCESS" "Backup created: $backup_dir/$backup_file"
    log "INFO" "Backup size: $(du -h "$backup_dir/$backup_file" | cut -f1)"
}

# Run security check
security_check() {
    log "INFO" "WIS Security Check"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    cd "$WIS_DOCKER_DIR"

    # Check for SSL certificate
    if [ -f "nginx/ssl/wis.unimogcommunityhub.com.crt" ]; then
        local cert_expiry=$(openssl x509 -in nginx/ssl/wis.unimogcommunityhub.com.crt -noout -enddate | cut -d= -f2)
        log "INFO" "SSL certificate expires: $cert_expiry"

        # Check if certificate expires in next 30 days
        if openssl x509 -in nginx/ssl/wis.unimogcommunityhub.com.crt -noout -checkend 2592000 > /dev/null; then
            log "SUCCESS" "SSL certificate is valid"
        else
            log "WARNING" "SSL certificate expires within 30 days"
        fi
    else
        log "WARNING" "SSL certificate not found"
    fi

    # Check for default passwords
    if grep -q "your_secure_database_password_here" .env 2>/dev/null; then
        log "ERROR" "Default database password detected - security risk!"
    else
        log "SUCCESS" "Database password has been changed from default"
    fi

    # Check firewall rules (if available)
    if command -v ufw > /dev/null; then
        log "INFO" "Firewall status:"
        ufw status
    fi

    # Check for exposed ports
    log "INFO" "Checking for exposed ports..."
    netstat -tulpn 2>/dev/null | grep -E ":(80|443|3389|5432)" || log "INFO" "Standard ports not found in netstat"
}

# Run full diagnostic
run_diagnostic() {
    log "INFO" "WIS Full Diagnostic Report"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    show_status
    echo
    show_resources
    echo
    show_sessions
    echo
    security_check
    echo

    # Test connectivity
    log "INFO" "Testing connectivity..."
    if [ -f "$SCRIPT_DIR/wis-session-test.js" ]; then
        node "$SCRIPT_DIR/wis-session-test.js"
    else
        log "WARNING" "Session test script not found"
    fi
}

# Show help
show_help() {
    echo "WIS System Monitoring and Management"
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  status              Show WIS system status"
    echo "  resources           Show resource usage"
    echo "  sessions            Show active sessions"
    echo "  logs [service]      Show logs (default: all services)"
    echo "  restart             Restart WIS services"
    echo "  maintenance         Run maintenance tasks"
    echo "  backup [dir]        Backup WIS data"
    echo "  security            Run security check"
    echo "  diagnostic          Run full diagnostic"
    echo "  help                Show this help"
    echo
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 logs guacamole"
    echo "  $0 backup /backup/wis"
    echo
}

# Main script logic
main() {
    check_docker_compose

    case "${1:-help}" in
        "status")
            show_status
            ;;
        "resources")
            show_resources
            ;;
        "sessions")
            show_sessions
            ;;
        "logs")
            show_logs "$2" "$3"
            ;;
        "restart")
            restart_services
            ;;
        "maintenance")
            run_maintenance
            ;;
        "backup")
            backup_data "$2"
            ;;
        "security")
            security_check
            ;;
        "diagnostic")
            run_diagnostic
            ;;
        "help")
            show_help
            ;;
        *)
            log "ERROR" "Unknown command: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"