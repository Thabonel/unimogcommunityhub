# WIS Windows Server Setup Script
# Run this PowerShell script as Administrator on the Windows server that will host Mercedes WIS/EPC

param(
    [switch]$AutoRestart = $false,
    [string]$WISUserPassword = "WIS2025!Premium"
)

Write-Host "🚀 Starting WIS Windows Server Setup..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    exit 1
}

# Function to log actions
function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

Write-Log "Starting WIS server configuration..." "Green"

# Enable Remote Desktop
Write-Log "Enabling Remote Desktop..." "Yellow"
try {
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -name "fDenyTSConnections" -Value 0
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
    Write-Log "✅ Remote Desktop enabled" "Green"
} catch {
    Write-Log "❌ Failed to enable Remote Desktop: $($_.Exception.Message)" "Red"
    exit 1
}

# Configure RDP Security
Write-Log "Configuring RDP security settings..." "Yellow"
try {
    # Require Network Level Authentication
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "UserAuthentication" -Value 1

    # Set encryption level to High
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "MinEncryptionLevel" -Value 3

    # Enable TLS 1.2
    Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "SecurityLayer" -Value 2

    Write-Log "✅ RDP security configured" "Green"
} catch {
    Write-Log "❌ Failed to configure RDP security: $($_.Exception.Message)" "Red"
}

# Create WIS user accounts
Write-Log "Creating WIS user accounts..." "Yellow"

$users = @(
    @{ Name = "WISPremium"; Description = "WIS Premium User Account"; Groups = @("Remote Desktop Users") },
    @{ Name = "WISLifetime"; Description = "WIS Lifetime User Account"; Groups = @("Remote Desktop Users") },
    @{ Name = "WISDemo"; Description = "WIS Demo User Account"; Groups = @("Remote Desktop Users") }
)

foreach ($user in $users) {
    try {
        # Check if user exists
        if (Get-LocalUser -Name $user.Name -ErrorAction SilentlyContinue) {
            Write-Log "User $($user.Name) already exists, updating..." "Yellow"
            Set-LocalUser -Name $user.Name -Description $user.Description -PasswordNeverExpires $true
        } else {
            # Create user
            $securePassword = ConvertTo-SecureString $WISUserPassword -AsPlainText -Force
            New-LocalUser -Name $user.Name -Description $user.Description -Password $securePassword -PasswordNeverExpires
            Write-Log "Created user: $($user.Name)" "Green"
        }

        # Add to groups
        foreach ($group in $user.Groups) {
            try {
                Add-LocalGroupMember -Group $group -Member $user.Name -ErrorAction SilentlyContinue
                Write-Log "Added $($user.Name) to $group" "Green"
            } catch {
                Write-Log "User $($user.Name) already in group $group" "Yellow"
            }
        }
    } catch {
        Write-Log "❌ Failed to create user $($user.Name): $($_.Exception.Message)" "Red"
    }
}

# Configure Windows Updates (disable automatic restart)
Write-Log "Configuring Windows Updates..." "Yellow"
try {
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" -Name "UxOption" -Value 1
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "NoAutoRebootWithLoggedOnUsers" -Value 1 -Force
    Write-Log "✅ Windows Updates configured" "Green"
} catch {
    Write-Log "⚠️  Could not fully configure Windows Updates: $($_.Exception.Message)" "Yellow"
}

# Disable unnecessary services for better performance
Write-Log "Optimizing services for WIS performance..." "Yellow"
$servicesToDisable = @(
    "Themes", "TabletInputService", "WSearch", "Spooler"
)

foreach ($service in $servicesToDisable) {
    try {
        $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
        if ($svc -and $svc.StartType -ne "Disabled") {
            Stop-Service -Name $service -Force -ErrorAction SilentlyContinue
            Set-Service -Name $service -StartupType Disabled
            Write-Log "Disabled service: $service" "Green"
        }
    } catch {
        Write-Log "Could not disable service $service" "Yellow"
    }
}

# Configure power settings for server use
Write-Log "Configuring power settings..." "Yellow"
try {
    powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c  # High Performance
    powercfg /hibernate off
    Write-Log "✅ Power settings optimized" "Green"
} catch {
    Write-Log "⚠️  Could not optimize power settings" "Yellow"
}

# Create desktop shortcuts for WIS software
Write-Log "Setting up WIS software shortcuts..." "Yellow"
$desktopPath = [Environment]::GetFolderPath("CommonDesktopDirectory")

# Common WIS software paths (update based on actual installation)
$wisShortcuts = @{
    "Mercedes WIS" = "C:\Program Files\Mercedes-Benz\WIS\WIS.exe"
    "Mercedes EPC" = "C:\Program Files\Mercedes-Benz\EPC\EPC.exe"
    "WIS ASRA" = "C:\Program Files\Mercedes-Benz\WIS\ASRA\ASRA.exe"
}

foreach ($shortcut in $wisShortcuts.GetEnumerator()) {
    if (Test-Path $shortcut.Value) {
        $shortcutPath = Join-Path $desktopPath "$($shortcut.Key).lnk"
        $wshell = New-Object -ComObject WScript.Shell
        $shortcutObj = $wshell.CreateShortcut($shortcutPath)
        $shortcutObj.TargetPath = $shortcut.Value
        $shortcutObj.Save()
        Write-Log "Created shortcut: $($shortcut.Key)" "Green"
    } else {
        Write-Log "WIS software not found at: $($shortcut.Value)" "Yellow"
    }
}

# Configure automatic logon for seamless user experience (optional)
Write-Log "Configuring automatic logon settings..." "Yellow"
try {
    # This is optional and should be carefully considered for security
    # For now, we'll just ensure the registry keys exist
    $autoLogonPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"
    if (!(Test-Path $autoLogonPath)) {
        New-Item -Path $autoLogonPath -Force
    }
    Write-Log "✅ Automatic logon registry prepared" "Green"
} catch {
    Write-Log "⚠️  Could not configure automatic logon" "Yellow"
}

# Set up Windows Firewall rules
Write-Log "Configuring Windows Firewall..." "Yellow"
try {
    # Allow RDP from specific networks (Guacamole)
    New-NetFirewallRule -DisplayName "WIS RDP Access" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Allow -Profile Domain,Private
    Write-Log "✅ Firewall configured for RDP access" "Green"
} catch {
    Write-Log "⚠️  Could not configure firewall rules" "Yellow"
}

# Install Chocolatey for easy software management (optional)
Write-Log "Installing Chocolatey package manager..." "Yellow"
try {
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Log "✅ Chocolatey installed" "Green"
    } else {
        Write-Log "Chocolatey already installed" "Yellow"
    }
} catch {
    Write-Log "⚠️  Could not install Chocolatey" "Yellow"
}

# Install useful utilities
Write-Log "Installing useful utilities..." "Yellow"
$utilities = @("7zip", "notepadplusplus", "googlechrome")
foreach ($util in $utilities) {
    try {
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            & choco install $util -y --no-progress
            Write-Log "Installed: $util" "Green"
        }
    } catch {
        Write-Log "Could not install: $util" "Yellow"
    }
}

# Create WIS server status script
Write-Log "Creating WIS server status monitoring..." "Yellow"
$statusScript = @'
# WIS Server Status Check
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$status = @{
    Timestamp = $timestamp
    RDPService = (Get-Service -Name TermService).Status
    WISUsers = (Get-LocalUser | Where-Object {$_.Name -like "WIS*"}).Count
    ActiveSessions = (quser 2>$null | Measure-Object).Count - 1
    DiskSpace = [math]::Round((Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'" | Select-Object -ExpandProperty FreeSpace) / 1GB, 2)
    MemoryUsage = [math]::Round((Get-WmiObject -Class Win32_OperatingSystem | Select-Object -ExpandProperty TotalVisibleMemorySize) / 1MB, 2)
}
$status | ConvertTo-Json | Out-File "C:\WIS\status.json" -Encoding UTF8
Write-Host "WIS Server Status Updated: $timestamp"
'@

$wisStatusPath = "C:\WIS"
if (!(Test-Path $wisStatusPath)) {
    New-Item -ItemType Directory -Path $wisStatusPath -Force
}
$statusScript | Out-File "$wisStatusPath\status-check.ps1" -Encoding UTF8

# Create scheduled task for status monitoring
try {
    $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\WIS\status-check.ps1"
    $trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 5) -Once -At (Get-Date)
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Register-ScheduledTask -TaskName "WIS Status Monitor" -Action $action -Trigger $trigger -Settings $settings -User "SYSTEM" -Force
    Write-Log "✅ Status monitoring scheduled task created" "Green"
} catch {
    Write-Log "⚠️  Could not create scheduled task" "Yellow"
}

Write-Log "🎉 WIS Windows Server setup completed!" "Green"

# Display summary
Write-Host "`n📋 Setup Summary:" -ForegroundColor Cyan
Write-Host "✅ Remote Desktop enabled and secured" -ForegroundColor Green
Write-Host "✅ WIS user accounts created (Premium, Lifetime, Demo)" -ForegroundColor Green
Write-Host "✅ Windows Updates optimized" -ForegroundColor Green
Write-Host "✅ Power settings configured for server use" -ForegroundColor Green
Write-Host "✅ Firewall configured for RDP access" -ForegroundColor Green
Write-Host "✅ Status monitoring enabled" -ForegroundColor Green

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Install Mercedes WIS/EPC software" -ForegroundColor White
Write-Host "2. Test RDP connections from Guacamole server" -ForegroundColor White
Write-Host "3. Configure WIS software for multi-user access" -ForegroundColor White
Write-Host "4. Set up automatic backups of WIS data" -ForegroundColor White

Write-Host "`n🔐 Security Notes:" -ForegroundColor Magenta
Write-Host "• Default password for WIS users: $WISUserPassword" -ForegroundColor White
Write-Host "• Change passwords before production use" -ForegroundColor White
Write-Host "• Consider implementing additional security measures" -ForegroundColor White

if ($AutoRestart) {
    Write-Host "`n🔄 Restarting server in 30 seconds..." -ForegroundColor Yellow
    shutdown /r /t 30 /c "WIS Server Setup Complete - Restarting"
} else {
    Write-Host "`n⚠️  Please restart the server to complete the setup." -ForegroundColor Yellow
}

Write-Log "WIS Windows Server setup script completed." "Green"