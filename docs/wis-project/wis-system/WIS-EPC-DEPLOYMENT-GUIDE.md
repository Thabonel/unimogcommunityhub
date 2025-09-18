# Mercedes WIS EPC Server Deployment Guide

This guide walks you through setting up the Mercedes WIS EPC server infrastructure for UnimogCommunityHub.

## Table of Contents
1. [Overview](#overview)
2. [Database Setup](#database-setup)
3. [Server Options](#server-options)
4. [Contabo VDS Setup](#contabo-vds-setup)
5. [Apache Guacamole Installation](#apache-guacamole-installation)
6. [WIS EPC Configuration](#wis-epc-configuration)
7. [Testing & Verification](#testing--verification)
8. [Maintenance](#maintenance)

## Overview

The WIS EPC integration uses a hybrid architecture:
- **Frontend**: React components in UnimogCommunityHub
- **Backend**: Supabase for session management and authentication
- **WIS Server**: Windows VPS running VirtualBox + WIS EPC + Apache Guacamole

## Database Setup

### Step 1: Apply the Migration

1. Go to your Supabase Dashboard SQL Editor:
   ```
   https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
   ```

2. Copy the contents of `wis-epc-migration.sql` (created by the setup script)

3. Paste and click "Run" to create all WIS EPC tables and functions

### Step 2: Verify Tables Created

The migration creates these tables:
- `wis_servers` - Server configuration and availability
- `wis_sessions` - User session management
- `wis_bookmarks` - Saved procedures
- `wis_usage_logs` - Usage tracking
- `user_subscriptions` - User tier management

## Server Options

### Option A: Contabo VDS (Recommended)
- **Cost**: $15-20/month
- **Specs**: Windows VDS M (4 vCPU, 8GB RAM, 200GB SSD)
- **Location**: Choose closest to your users
- **OS**: Windows Server 2019/2022

### Option B: Alternative VPS Providers
- DigitalOcean (Windows Droplets)
- Vultr (Windows instances)
- Linode (Windows VPS)
- AWS EC2 (t3.medium or larger)

## Contabo VDS Setup

### 1. Purchase VDS
1. Go to [Contabo VDS](https://contabo.com/en/vps/)
2. Select "VDS M" or larger
3. Choose Windows Server 2019/2022
4. Complete purchase

### 2. Initial Server Setup
```bash
# Connect via RDP
mstsc /v:your-server-ip

# Once connected:
# 1. Update Windows
# 2. Install Chrome/Firefox
# 3. Disable IE Enhanced Security
# 4. Configure Windows Firewall
```

### 3. Install Required Software

#### VirtualBox
```powershell
# Download VirtualBox
Invoke-WebRequest -Uri "https://download.virtualbox.org/virtualbox/7.0.14/VirtualBox-7.0.14-161095-Win.exe" -OutFile "VirtualBox.exe"

# Install VirtualBox
.\VirtualBox.exe --silent

# Install Extension Pack
Invoke-WebRequest -Uri "https://download.virtualbox.org/virtualbox/7.0.14/Oracle_VM_VirtualBox_Extension_Pack-7.0.14.vbox-extpack" -OutFile "extpack.vbox-extpack"
```

#### Java (for Guacamole)
```powershell
# Download OpenJDK 11
Invoke-WebRequest -Uri "https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip" -OutFile "openjdk.zip"

# Extract and set JAVA_HOME
Expand-Archive -Path "openjdk.zip" -DestinationPath "C:\Java"
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Java\jdk-11.0.2", "Machine")
```

## Apache Guacamole Installation

### 1. Install Tomcat
```powershell
# Download Tomcat 9
Invoke-WebRequest -Uri "https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.84/bin/apache-tomcat-9.0.84-windows-x64.zip" -OutFile "tomcat.zip"

# Extract Tomcat
Expand-Archive -Path "tomcat.zip" -DestinationPath "C:\Tomcat"

# Install as Windows Service
C:\Tomcat\apache-tomcat-9.0.84\bin\service.bat install
```

### 2. Deploy Guacamole
```powershell
# Download Guacamole WAR
Invoke-WebRequest -Uri "https://apache.org/dyn/closer.lua/guacamole/1.5.4/binary/guacamole-1.5.4.war?action=download" -OutFile "guacamole.war"

# Copy to Tomcat webapps
Copy-Item "guacamole.war" -Destination "C:\Tomcat\apache-tomcat-9.0.84\webapps\"

# Start Tomcat
Start-Service Tomcat9
```

### 3. Configure Guacamole

Create `C:\guacamole\guacamole.properties`:
```properties
guacd-hostname: localhost
guacd-port: 4822
user-mapping: C:/guacamole/user-mapping.xml
```

Create `C:\guacamole\user-mapping.xml`:
```xml
<user-mapping>
    <authorize username="wis_user" password="secure_password">
        <connection name="WIS_EPC">
            <protocol>rdp</protocol>
            <param name="hostname">localhost</param>
            <param name="port">3389</param>
            <param name="username">Administrator</param>
            <param name="password">vm_password</param>
            <param name="ignore-cert">true</param>
            <param name="security">nla</param>
            <param name="disable-audio">true</param>
            <param name="enable-drive">false</param>
            <param name="console">false</param>
        </connection>
    </authorize>
</user-mapping>
```

### 4. Install guacd (Windows)
For Windows, use Docker or WSL2 to run guacd:
```powershell
# Install Docker Desktop
# Then run guacd container
docker run --name guacd -d -p 4822:4822 guacamole/guacd
```

## WIS EPC Configuration

### 1. Import WIS EPC VM
1. Copy your WIS EPC VirtualBox VM to the server
2. Import in VirtualBox:
   ```
   VBoxManage import "WIS_EPC.ova"
   ```

### 2. Configure VM Autostart
```powershell
# Set VM to start with Windows
VBoxManage modifyvm "WIS_EPC" --autostart-enabled on
VBoxManage modifyvm "WIS_EPC" --autostart-delay 30

# Start the VM
VBoxManage startvm "WIS_EPC" --type headless
```

### 3. Configure Networking
```powershell
# Open required ports in Windows Firewall
New-NetFirewallRule -DisplayName "Guacamole" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "RDP" -Direction Inbound -LocalPort 3389 -Protocol TCP -Action Allow
```

## Testing & Verification

### 1. Test Guacamole Access
1. Open browser to: `http://your-server-ip:8080/guacamole`
2. Login with credentials from user-mapping.xml
3. Verify you can connect to WIS EPC

### 2. Update Supabase Database
```sql
-- Add your WIS server
INSERT INTO wis_servers (
  name, 
  host_url, 
  guacamole_url, 
  max_concurrent_sessions, 
  status,
  metadata
) VALUES (
  'WIS EPC Production Server',
  'your-server-ip:3389',
  'http://your-server-ip:8080/guacamole',
  5,
  'active',
  '{"environment": "production", "region": "your-region"}'::jsonb
);
```

### 3. Test from UnimogCommunityHub
1. Login to your site
2. Navigate to Knowledge Base → Mercedes WIS EPC
3. Click "Start WIS EPC Session"
4. Verify connection works

## Maintenance

### Daily Tasks
- Monitor server resources
- Check active sessions
- Review error logs

### Weekly Tasks
- Windows Updates
- VirtualBox Updates
- Backup WIS EPC VM

### Monthly Tasks
- Review usage statistics
- Clean up expired sessions
- Update Guacamole if needed

### Monitoring Commands
```sql
-- Check active sessions
SELECT * FROM wis_sessions WHERE status = 'active';

-- Check server load
SELECT * FROM wis_servers;

-- Monthly usage by user
SELECT 
  u.email,
  us.tier,
  us.monthly_minutes_used
FROM user_subscriptions us
JOIN auth.users u ON u.id = us.user_id
ORDER BY us.monthly_minutes_used DESC;
```

## Troubleshooting

### Common Issues

1. **Can't connect to Guacamole**
   - Check Windows Firewall
   - Verify Tomcat is running
   - Check guacd container status

2. **WIS EPC VM won't start**
   - Check VirtualBox logs
   - Verify sufficient RAM
   - Check disk space

3. **Session timeout issues**
   - Adjust session limits in database
   - Check Guacamole timeout settings
   - Monitor server resources

### Support Resources
- [Apache Guacamole Documentation](https://guacamole.apache.org/doc/gug/)
- [VirtualBox Manual](https://www.virtualbox.org/manual/)
- [Contabo Support](https://contabo.com/en/support/)

## Security Considerations

1. **Use HTTPS**: Set up SSL certificate for Guacamole
2. **Firewall Rules**: Only allow necessary ports
3. **Strong Passwords**: Use secure passwords for all services
4. **Regular Updates**: Keep all software updated
5. **Backup Strategy**: Regular VM snapshots and backups

## Next Steps

After server setup:
1. Configure SSL/HTTPS for secure access
2. Set up monitoring and alerts
3. Create user documentation
4. Plan scaling strategy for growth