# WIS EPC Budget Deployment Guide - Time4VPS

This guide shows how to deploy WIS EPC on Time4VPS for just €14.29/month (or €4.57/month annually).

## Cost Comparison
- **Original Contabo VDS**: €34-40/month
- **Time4VPS Windows VPS**: €14.29/month
- **Annual Discount**: €54.84/year (€4.57/month)
- **Savings**: 58-81% cheaper!

## Requirements Checklist
✅ Windows Server license (included)
✅ Nested virtualization support
✅ 8GB+ RAM for host + VM
✅ 100GB+ storage
✅ EU data center location

## Step 1: Purchase Time4VPS

1. Go to [Time4VPS](https://www.time4vps.com/)
2. Choose **Windows VPS** plan:
   - Minimum: 8GB RAM, 2 vCPUs
   - Recommended: 16GB RAM, 4 vCPUs for better performance
3. Select **Windows Server 2019/2022**
4. Choose **Annual billing** for maximum savings

## Step 2: Initial Windows Setup

```powershell
# Connect via RDP
mstsc /v:your-server-ip

# 1. Update Windows
sconfig

# 2. Enable Remote Desktop
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -name "fDenyTSConnections" -value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# 3. Install Chocolatey (package manager)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

## Step 3: Install Required Software

```powershell
# Install VirtualBox
choco install virtualbox -y

# Install Git
choco install git -y

# Install OpenJDK (for Guacamole)
choco install openjdk11 -y

# Install Tomcat
choco install tomcat -y
```

## Step 4: Deploy Apache Guacamole (Simplified)

Instead of full Guacamole, use **SimpleRDP** - a lightweight alternative:

```powershell
# Download SimpleRDP
Invoke-WebRequest -Uri "https://github.com/FreeRDP/FreeRDP-WebConnect/releases/download/v1.0/wsgate-1.0.zip" -OutFile "wsgate.zip"

# Extract
Expand-Archive -Path "wsgate.zip" -DestinationPath "C:\wsgate"

# Configure IIS
Install-WindowsFeature -name Web-Server -IncludeManagementTools
Install-WindowsFeature -name Web-WebSockets

# Set up as IIS site
New-Website -Name "WIS-Gateway" -Port 8080 -PhysicalPath "C:\wsgate"
```

## Step 5: Import WIS EPC VM

```powershell
# Create VMs directory
New-Item -ItemType Directory -Path "C:\VMs"

# Import your WIS EPC VM
VBoxManage import "C:\path\to\WIS_EPC.ova" --vsys 0 --vmname "WIS_EPC" --basefolder "C:\VMs"

# Configure VM
VBoxManage modifyvm "WIS_EPC" --memory 4096 --cpus 2
VBoxManage modifyvm "WIS_EPC" --vrde on --vrdeport 3389 --vrdeauthtype null

# Start VM
VBoxManage startvm "WIS_EPC" --type headless
```

## Step 6: Configure Firewall

```powershell
# Open required ports
New-NetFirewallRule -DisplayName "WIS Gateway" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "RDP" -Direction Inbound -LocalPort 3389 -Protocol TCP -Action Allow
```

## Step 7: Update Supabase

```sql
-- Update your WIS server configuration
UPDATE wis_servers 
SET 
  host_url = 'your-time4vps-ip:3389',
  guacamole_url = 'http://your-time4vps-ip:8080',
  status = 'active',
  specs = jsonb_set(specs, '{provider}', '"Time4VPS"')
WHERE name = 'WIS EPC Development Server';
```

## Alternative: Even Cheaper Option

### Using Linux + Wine (€6.50/month)

If you want to save even more money, use VPSDime with Linux:

1. **VPSDime Linux VPS**: €6.50/month
2. Install Ubuntu Server
3. Use Wine to run WIS EPC directly (no VirtualBox needed)
4. Use x11vnc + noVNC for web access

```bash
# Quick setup on Linux
sudo apt update
sudo apt install wine wine32 wine64 x11vnc novnc

# Run WIS EPC with Wine
wine WIS_EPC_Setup.exe
```

## Monitoring & Maintenance

```powershell
# Create scheduled task for auto-start
$action = New-ScheduledTaskAction -Execute "VBoxManage" -Argument "startvm WIS_EPC --type headless"
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -TaskName "Start WIS EPC" -Action $action -Trigger $trigger -RunLevel Highest

# Monitor resources
Get-Process VirtualBox* | Select-Object Name, CPU, WorkingSet
```

## Security Hardening

1. **Change default passwords**
2. **Use Windows Firewall** to restrict access
3. **Enable SSL/TLS** for web access
4. **Set up fail2ban** equivalent for Windows
5. **Regular backups** of the VM

## Support & Troubleshooting

### Time4VPS Support
- 24/7 ticket support
- Knowledge base
- Community forum

### Common Issues
1. **Nested virtualization not working**
   - Ensure CPU virtualization is enabled
   - Contact Time4VPS support

2. **Performance issues**
   - Upgrade to higher plan if needed
   - Optimize Windows services

3. **Connection issues**
   - Check firewall rules
   - Verify public IP accessibility

## Summary

Total monthly cost: **€14.29** (or €4.57/month annually)
- Includes Windows license
- Supports VirtualBox
- EU-based hosting
- 58% cheaper than Contabo VDS

Ready to deploy!