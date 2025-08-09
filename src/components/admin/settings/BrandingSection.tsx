
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsTooltip } from "./SettingsTooltip";
import { toast } from "@/hooks/use-toast";
import { Check, Upload, X } from "lucide-react";
import { uploadFile } from "@/components/shared/photo-upload/utils/fileUploadUtils";
import { STORAGE_BUCKETS } from '@/lib/supabase-client';

export function BrandingSection() {
  const [branding, setBranding] = useState({
    siteName: "Unimog Community Hub",
    logoUrl: "/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png",
    faviconUrl: "/favicon.ico",
    colorScheme: "default",
    primaryColor: "#9b87f5",
    secondaryColor: "#7E69AB",
    accentColor: "#6E59A5",
    fontPrimary: "Inter",
    fontHeadings: "Inter",
    customCss: "",
    customHeaderHtml: "",
    customFooterHtml: "",
    socialMediaLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    }
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  
  // References for file inputs
  const logoFileInputRef = useState<HTMLInputElement | null>(null);
  const faviconFileInputRef = useState<HTMLInputElement | null>(null);

  const handleColorSchemeChange = (scheme: string) => {
    let primaryColor = "#9b87f5";
    let secondaryColor = "#7E69AB";
    let accentColor = "#6E59A5";
    
    if (scheme === "blue") {
      primaryColor = "#0EA5E9";
      secondaryColor = "#0284C7";
      accentColor = "#0369A1";
    } else if (scheme === "green") {
      primaryColor = "#10B981";
      secondaryColor = "#059669";
      accentColor = "#047857";
    } else if (scheme === "red") {
      primaryColor = "#EF4444";
      secondaryColor = "#DC2626";
      accentColor = "#B91C1C";
    }
    
    setBranding({
      ...branding,
      colorScheme: scheme,
      primaryColor,
      secondaryColor,
      accentColor
    });
  };

  const handleLogoUpload = () => {
    // Open the file dialog
    if (logoFileInputRef[0]) {
      logoFileInputRef[0].click();
    }
  };
  
  const handleLogoFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadingLogo(true);
    
    try {
      // Buckets already exist in Supabase, no need to create them
      
      // Upload the file
      const publicUrl = await uploadFile(file, 'profile', toast);
      
      if (publicUrl) {
        setBranding({
          ...branding,
          logoUrl: publicUrl
        });
        
        toast({
          title: "Logo uploaded",
          description: "Your new logo has been uploaded successfully."
        });
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your logo.",
        variant: "destructive"
      });
    } finally {
      setUploadingLogo(false);
      // Reset the input to allow selecting the same file again
      if (logoFileInputRef[0]) {
        logoFileInputRef[0].value = '';
      }
    }
  };

  const handleFaviconUpload = () => {
    // Open the file dialog
    if (faviconFileInputRef[0]) {
      faviconFileInputRef[0].click();
    }
  };
  
  const handleFaviconFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadingFavicon(true);
    
    try {
      // Buckets already exist in Supabase, no need to create them
      
      // Upload the file - using the profile bucket for simplicity, but we could
      // create a dedicated favicon bucket if needed
      const publicUrl = await uploadFile(file, 'profile', toast);
      
      if (publicUrl) {
        setBranding({
          ...branding,
          faviconUrl: publicUrl
        });
        
        toast({
          title: "Favicon uploaded",
          description: "Your new favicon has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading favicon:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your favicon.",
        variant: "destructive"
      });
    } finally {
      setUploadingFavicon(false);
      // Reset the input to allow selecting the same file again
      if (faviconFileInputRef[0]) {
        faviconFileInputRef[0].value = '';
      }
    }
  };

  const handleSave = () => {
    toast({
      title: "Branding settings saved",
      description: "Your branding settings have been updated successfully."
    });
    
    // In a real implementation, we would also update the favicon
    // in the document head to apply the change immediately
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon && branding.faviconUrl) {
      existingFavicon.setAttribute('href', branding.faviconUrl);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="colors">Colors & Fonts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">
                Site Name
                <SettingsTooltip content="The name of your community displayed across the platform" />
              </Label>
              <Input 
                id="siteName" 
                value={branding.siteName}
                onChange={(e) => setBranding({...branding, siteName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>
                Logo
                <SettingsTooltip content="Your main site logo displayed in the header (recommended size: 180x60px)" />
              </Label>
              <div className="flex items-center gap-4">
                <div className="border rounded-md p-4 w-64 h-24 flex items-center justify-center bg-white">
                  {branding.logoUrl ? (
                    <img 
                      src={branding.logoUrl} 
                      alt="Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground">No logo uploaded</div>
                  )}
                </div>
                <div className="space-y-2">
                  {/* Hidden file input for logo */}
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoFileSelected}
                    ref={(input) => logoFileInputRef[0] = input}
                  />
                  <Button 
                    onClick={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="w-full"
                  >
                    {uploadingLogo ? (
                      <><span className="animate-spin mr-2">⟳</span> Uploading...</>
                    ) : (
                      <><Upload className="mr-2 h-4 w-4" /> Upload Logo</>
                    )}
                  </Button>
                  {branding.logoUrl && (
                    <Button 
                      variant="outline" 
                      onClick={() => setBranding({...branding, logoUrl: ""})}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" /> Remove Logo
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                Favicon
                <SettingsTooltip content="The icon shown in browser tabs (recommended size: 32x32px)" />
              </Label>
              <div className="flex items-center gap-4">
                <div className="border rounded-md p-4 w-16 h-16 flex items-center justify-center bg-white">
                  {branding.faviconUrl ? (
                    <img 
                      src={branding.faviconUrl} 
                      alt="Favicon" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-xs">No icon</div>
                  )}
                </div>
                <div className="space-y-2">
                  {/* Hidden file input for favicon */}
                  <input 
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml,image/x-icon"
                    className="hidden"
                    onChange={handleFaviconFileSelected}
                    ref={(input) => faviconFileInputRef[0] = input}
                  />
                  <Button 
                    onClick={handleFaviconUpload}
                    disabled={uploadingFavicon}
                    size="sm"
                  >
                    {uploadingFavicon ? (
                      <><span className="animate-spin mr-2">⟳</span> Uploading...</>
                    ) : (
                      <><Upload className="mr-2 h-4 w-4" /> Upload Favicon</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label>Social Media Links</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="text-sm">Facebook URL</Label>
                  <Input 
                    id="facebook" 
                    value={branding.socialMediaLinks.facebook}
                    onChange={(e) => setBranding({
                      ...branding, 
                      socialMediaLinks: {
                        ...branding.socialMediaLinks,
                        facebook: e.target.value
                      }
                    })}
                    placeholder="https://facebook.com/yourbrand"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm">Twitter URL</Label>
                  <Input 
                    id="twitter" 
                    value={branding.socialMediaLinks.twitter}
                    onChange={(e) => setBranding({
                      ...branding, 
                      socialMediaLinks: {
                        ...branding.socialMediaLinks,
                        twitter: e.target.value
                      }
                    })}
                    placeholder="https://twitter.com/yourbrand"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm">Instagram URL</Label>
                  <Input 
                    id="instagram" 
                    value={branding.socialMediaLinks.instagram}
                    onChange={(e) => setBranding({
                      ...branding, 
                      socialMediaLinks: {
                        ...branding.socialMediaLinks,
                        instagram: e.target.value
                      }
                    })}
                    placeholder="https://instagram.com/yourbrand"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-sm">YouTube URL</Label>
                  <Input 
                    id="youtube" 
                    value={branding.socialMediaLinks.youtube}
                    onChange={(e) => setBranding({
                      ...branding, 
                      socialMediaLinks: {
                        ...branding.socialMediaLinks,
                        youtube: e.target.value
                      }
                    })}
                    placeholder="https://youtube.com/yourbrand"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Color Scheme
                <SettingsTooltip content="Choose a predefined color scheme or customize your own colors" />
              </Label>
              <RadioGroup 
                value={branding.colorScheme}
                onValueChange={handleColorSchemeChange}
                className="flex flex-wrap gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default" className="flex items-center cursor-pointer">
                    <span className="w-6 h-6 rounded-full bg-[#9b87f5] mr-2"></span>
                    Purple (Default)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blue" id="blue" />
                  <Label htmlFor="blue" className="flex items-center cursor-pointer">
                    <span className="w-6 h-6 rounded-full bg-[#0EA5E9] mr-2"></span>
                    Blue
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="green" id="green" />
                  <Label htmlFor="green" className="flex items-center cursor-pointer">
                    <span className="w-6 h-6 rounded-full bg-[#10B981] mr-2"></span>
                    Green
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="red" id="red" />
                  <Label htmlFor="red" className="flex items-center cursor-pointer">
                    <span className="w-6 h-6 rounded-full bg-[#EF4444] mr-2"></span>
                    Red
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>
            </div>

            {branding.colorScheme === "custom" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">
                      Primary Color
                      <SettingsTooltip content="Main brand color used for buttons and interactive elements" />
                    </Label>
                    <div className="flex">
                      <Input 
                        id="primaryColor" 
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                      />
                      <div 
                        className="w-10 h-10 border rounded-md ml-2" 
                        style={{ backgroundColor: branding.primaryColor }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">
                      Secondary Color
                      <SettingsTooltip content="Used for secondary elements and accents" />
                    </Label>
                    <div className="flex">
                      <Input 
                        id="secondaryColor" 
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                      />
                      <div 
                        className="w-10 h-10 border rounded-md ml-2" 
                        style={{ backgroundColor: branding.secondaryColor }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">
                      Accent Color
                      <SettingsTooltip content="Used for highlights and special elements" />
                    </Label>
                    <div className="flex">
                      <Input 
                        id="accentColor" 
                        value={branding.accentColor}
                        onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                      />
                      <div 
                        className="w-10 h-10 border rounded-md ml-2" 
                        style={{ backgroundColor: branding.accentColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontPrimary">
                    Primary Font
                    <SettingsTooltip content="Main font used throughout the site" />
                  </Label>
                  <select 
                    id="fontPrimary"
                    value={branding.fontPrimary}
                    onChange={(e) => setBranding({...branding, fontPrimary: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Inter">Inter (Default)</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontHeadings">
                    Headings Font
                    <SettingsTooltip content="Font used for titles and headings" />
                  </Label>
                  <select 
                    id="fontHeadings"
                    value={branding.fontHeadings}
                    onChange={(e) => setBranding({...branding, fontHeadings: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Inter">Inter (Default)</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customCss">
                Custom CSS
                <SettingsTooltip content="Add custom CSS to customize the appearance of your site" />
              </Label>
              <textarea 
                id="customCss" 
                value={branding.customCss}
                onChange={(e) => setBranding({...branding, customCss: e.target.value})}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="/* Add your custom CSS here */"
              />
              <p className="text-xs text-muted-foreground">
                Advanced: Add custom CSS to override default styling
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customHeaderHtml">
                Custom Header HTML
                <SettingsTooltip content="Add custom HTML to the header section of your site" />
              </Label>
              <textarea 
                id="customHeaderHtml" 
                value={branding.customHeaderHtml}
                onChange={(e) => setBranding({...branding, customHeaderHtml: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="<!-- Add custom header HTML here -->"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customFooterHtml">
                Custom Footer HTML
                <SettingsTooltip content="Add custom HTML to the footer section of your site" />
              </Label>
              <textarea 
                id="customFooterHtml" 
                value={branding.customFooterHtml}
                onChange={(e) => setBranding({...branding, customFooterHtml: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="<!-- Add custom footer HTML here -->"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Branding Settings</Button>
      </div>
    </div>
  );
}
