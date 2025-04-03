
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SettingsTooltip } from "./SettingsTooltip";
import { toast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

export function SecuritySettingsSection() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: {
      enabled: true,
      required: false,
      methods: {
        email: true,
        authenticator: true,
        sms: false,
      },
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiration: 0, // 0 means never expires
    },
    sessionSecurity: {
      sessionTimeout: 60, // minutes
      maxActiveSessions: 5,
      enforceSignOut: false,
    },
    loginProtection: {
      maxLoginAttempts: 5,
      lockoutDuration: 30, // minutes
      ipRateLimiting: true,
      loginNotifications: true,
    }
  });

  const handleSave = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
      </div>
      
      <div className="space-y-4 ml-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="twoFactorEnabled" className="flex items-center cursor-pointer">
              Enable Two-Factor Authentication
              <SettingsTooltip content="Allow users to set up 2FA for their accounts" />
            </Label>
            <p className="text-sm text-muted-foreground">
              Adds an extra layer of security to user accounts
            </p>
          </div>
          <Switch 
            id="twoFactorEnabled" 
            checked={securitySettings.twoFactorAuth.enabled}
            onCheckedChange={(checked) => setSecuritySettings({
              ...securitySettings,
              twoFactorAuth: {
                ...securitySettings.twoFactorAuth,
                enabled: checked
              }
            })}
          />
        </div>
        
        {securitySettings.twoFactorAuth.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactorRequired" className="flex items-center cursor-pointer">
                Require Two-Factor Authentication
                <SettingsTooltip content="Force all users to set up 2FA for their accounts" />
              </Label>
              <Switch 
                id="twoFactorRequired" 
                checked={securitySettings.twoFactorAuth.required}
                onCheckedChange={(checked) => setSecuritySettings({
                  ...securitySettings,
                  twoFactorAuth: {
                    ...securitySettings.twoFactorAuth,
                    required: checked
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Available 2FA Methods</Label>
              <div className="space-y-2 ml-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="2faEmail" 
                    checked={securitySettings.twoFactorAuth.methods.email}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: {
                        ...securitySettings.twoFactorAuth,
                        methods: {
                          ...securitySettings.twoFactorAuth.methods,
                          email: !!checked
                        }
                      }
                    })}
                  />
                  <Label htmlFor="2faEmail" className="cursor-pointer">Email code</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="2faAuthenticator" 
                    checked={securitySettings.twoFactorAuth.methods.authenticator}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: {
                        ...securitySettings.twoFactorAuth,
                        methods: {
                          ...securitySettings.twoFactorAuth.methods,
                          authenticator: !!checked
                        }
                      }
                    })}
                  />
                  <Label htmlFor="2faAuthenticator" className="cursor-pointer">Authenticator app</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="2faSms" 
                    checked={securitySettings.twoFactorAuth.methods.sms}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: {
                        ...securitySettings.twoFactorAuth,
                        methods: {
                          ...securitySettings.twoFactorAuth.methods,
                          sms: !!checked
                        }
                      }
                    })}
                  />
                  <Label htmlFor="2faSms" className="cursor-pointer">SMS (additional setup required)</Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Password Policy</h3>
        <div className="space-y-4 mt-4 ml-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="passwordMinLength" className="flex items-center">
                Minimum Password Length
                <SettingsTooltip content="Minimum number of characters required in passwords" />
              </Label>
              <span className="text-sm font-medium">{securitySettings.passwordPolicy.minLength} characters</span>
            </div>
            <Slider
              id="passwordMinLength"
              min={6}
              max={16}
              step={1}
              value={[securitySettings.passwordPolicy.minLength]}
              onValueChange={(value) => setSecuritySettings({
                ...securitySettings,
                passwordPolicy: {
                  ...securitySettings.passwordPolicy,
                  minLength: value[0]
                }
              })}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Password Requirements</Label>
            <div className="space-y-2 ml-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireUppercase" 
                  checked={securitySettings.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => setSecuritySettings({
                    ...securitySettings,
                    passwordPolicy: {
                      ...securitySettings.passwordPolicy,
                      requireUppercase: !!checked
                    }
                  })}
                />
                <Label htmlFor="requireUppercase" className="cursor-pointer">Require uppercase letters</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireLowercase" 
                  checked={securitySettings.passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) => setSecuritySettings({
                    ...securitySettings,
                    passwordPolicy: {
                      ...securitySettings.passwordPolicy,
                      requireLowercase: !!checked
                    }
                  })}
                />
                <Label htmlFor="requireLowercase" className="cursor-pointer">Require lowercase letters</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireNumbers" 
                  checked={securitySettings.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => setSecuritySettings({
                    ...securitySettings,
                    passwordPolicy: {
                      ...securitySettings.passwordPolicy,
                      requireNumbers: !!checked
                    }
                  })}
                />
                <Label htmlFor="requireNumbers" className="cursor-pointer">Require numbers</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="requireSpecialChars" 
                  checked={securitySettings.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => setSecuritySettings({
                    ...securitySettings,
                    passwordPolicy: {
                      ...securitySettings.passwordPolicy,
                      requireSpecialChars: !!checked
                    }
                  })}
                />
                <Label htmlFor="requireSpecialChars" className="cursor-pointer">Require special characters</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passwordExpiration">
              Password Expiration
              <SettingsTooltip content="Force users to change password after a number of days (0 = never)" />
            </Label>
            <select 
              id="passwordExpiration"
              value={securitySettings.passwordPolicy.passwordExpiration}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                passwordPolicy: {
                  ...securitySettings.passwordPolicy,
                  passwordExpiration: Number(e.target.value)
                }
              })}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="0">Never</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
            </select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Session Security</h3>
        <div className="space-y-4 mt-4 ml-6">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">
              Session Timeout (minutes)
              <SettingsTooltip content="Automatically log users out after this period of inactivity" />
            </Label>
            <div className="flex space-x-2">
              <Select
                value={securitySettings.sessionSecurity.sessionTimeout.toString()}
                onValueChange={(value) => setSecuritySettings({
                  ...securitySettings,
                  sessionSecurity: {
                    ...securitySettings.sessionSecurity,
                    sessionTimeout: parseInt(value)
                  }
                })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxActiveSessions">
              Maximum Active Sessions
              <SettingsTooltip content="Maximum number of devices a user can be logged in simultaneously" />
            </Label>
            <Input 
              id="maxActiveSessions" 
              type="number"
              min="1"
              max="10"
              value={securitySettings.sessionSecurity.maxActiveSessions}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                sessionSecurity: {
                  ...securitySettings.sessionSecurity,
                  maxActiveSessions: parseInt(e.target.value) || 5
                }
              })} 
              className="w-24"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enforceSignOut" className="flex items-center cursor-pointer">
              Enforce Sign Out Across Devices
              <SettingsTooltip content="When a user changes their password, sign them out from all devices" />
            </Label>
            <Switch 
              id="enforceSignOut" 
              checked={securitySettings.sessionSecurity.enforceSignOut}
              onCheckedChange={(checked) => setSecuritySettings({
                ...securitySettings,
                sessionSecurity: {
                  ...securitySettings.sessionSecurity,
                  enforceSignOut: checked
                }
              })}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Login Protection</h3>
        <div className="space-y-4 mt-4 ml-6">
          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">
              Max Failed Login Attempts Before Lockout
              <SettingsTooltip content="Number of failed login attempts before account is temporarily locked" />
            </Label>
            <Input 
              id="maxLoginAttempts" 
              type="number"
              min="1"
              max="10"
              value={securitySettings.loginProtection.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                loginProtection: {
                  ...securitySettings.loginProtection,
                  maxLoginAttempts: parseInt(e.target.value) || 5
                }
              })} 
              className="w-24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lockoutDuration">
              Account Lockout Duration (minutes)
              <SettingsTooltip content="How long accounts remain locked after too many failed login attempts" />
            </Label>
            <Input 
              id="lockoutDuration" 
              type="number"
              min="5"
              max="1440"
              value={securitySettings.loginProtection.lockoutDuration}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                loginProtection: {
                  ...securitySettings.loginProtection,
                  lockoutDuration: parseInt(e.target.value) || 30
                }
              })} 
              className="w-24"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="ipRateLimiting" className="flex items-center cursor-pointer">
              IP Address Rate Limiting
              <SettingsTooltip content="Limit login attempts from the same IP address to prevent brute force attacks" />
            </Label>
            <Switch 
              id="ipRateLimiting" 
              checked={securitySettings.loginProtection.ipRateLimiting}
              onCheckedChange={(checked) => setSecuritySettings({
                ...securitySettings,
                loginProtection: {
                  ...securitySettings.loginProtection,
                  ipRateLimiting: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="loginNotifications" className="flex items-center cursor-pointer">
              Unusual Login Notifications
              <SettingsTooltip content="Email users when their account is accessed from a new device or location" />
            </Label>
            <Switch 
              id="loginNotifications" 
              checked={securitySettings.loginProtection.loginNotifications}
              onCheckedChange={(checked) => setSecuritySettings({
                ...securitySettings,
                loginProtection: {
                  ...securitySettings.loginProtection,
                  loginNotifications: checked
                }
              })}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave}>Save Security Settings</Button>
      </div>
    </div>
  );
}
