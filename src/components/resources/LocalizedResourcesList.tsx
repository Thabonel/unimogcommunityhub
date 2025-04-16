
import { useLocalization } from '@/contexts/LocalizationContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TranslatedText, { TranslatedH2 } from '@/components/localization/TranslatedText';
import { useState } from 'react';

// Mock data - In a real application, this would come from your database
const countrySpecificResources = {
  AU: {
    dealerships: [
      { name: "Australian Unimog Center", location: "Sydney", contact: "+61 2 1234 5678" },
      { name: "Melbourne Unimog Specialists", location: "Melbourne", contact: "+61 3 8765 4321" }
    ],
    serviceCenters: [
      { name: "Outback Unimog Service", location: "Alice Springs", contact: "+61 8 1234 5678" },
      { name: "Brisbane Unimog Repairs", location: "Brisbane", contact: "+61 7 8765 4321" }
    ],
    spareParts: [
      { name: "Aussie Unimog Parts", location: "Perth", website: "www.aussieunimogparts.com.au" },
      { name: "Sydney Unimog Spares", location: "Sydney", website: "www.sydneyunimogspares.com.au" }
    ],
    regulations: [
      { title: "Australian Off-road Vehicle Standards", description: "Regulations for off-road vehicles in Australia" },
      { title: "Queensland Heavy Vehicle Rules", description: "Special rules for Unimogs in Queensland" }
    ]
  },
  GB: {
    dealerships: [
      { name: "UK Unimog Sales", location: "London", contact: "+44 20 1234 5678" },
      { name: "Northern Unimog Specialists", location: "Manchester", contact: "+44 161 876 5432" }
    ],
    serviceCenters: [
      { name: "London Unimog Service Center", location: "London", contact: "+44 20 8765 4321" },
      { name: "Scottish Unimog Engineers", location: "Edinburgh", contact: "+44 131 234 5678" }
    ],
    spareParts: [
      { name: "UK Unimog Parts Ltd", location: "Birmingham", website: "www.ukunimogparts.co.uk" },
      { name: "Classic Unimog Spares", location: "Bristol", website: "www.classicunimogspares.co.uk" }
    ],
    regulations: [
      { title: "UK Heavy Vehicle MOT Requirements", description: "MOT testing requirements for Unimogs" },
      { title: "Off-road Vehicle Tax Exemptions", description: "Tax rules for agricultural Unimogs" }
    ]
  },
  DE: {
    dealerships: [
      { name: "Mercedes-Benz Unimog Zentrum", location: "Stuttgart", contact: "+49 711 1234 5678" },
      { name: "Bayern Unimog Handel", location: "München", contact: "+49 89 8765 4321" }
    ],
    serviceCenters: [
      { name: "Unimog Service Berlin", location: "Berlin", contact: "+49 30 1234 5678" },
      { name: "Hamburg Unimog Werkstatt", location: "Hamburg", contact: "+49 40 8765 4321" }
    ],
    spareParts: [
      { name: "Original Unimog Teile", location: "Köln", website: "www.unimog-teile.de" },
      { name: "Unimog Ersatzteile Shop", location: "Frankfurt", website: "www.unimog-ersatzteile.de" }
    ],
    regulations: [
      { title: "StVZO Richtlinien für Unimogs", description: "Straßenverkehrs-Zulassungs-Ordnung für Unimogs" },
      { title: "Land- und forstwirtschaftliche Fahrzeugvorschriften", description: "Sonderregelungen für Unimogs in der Landwirtschaft" }
    ]
  },
  TR: {
    dealerships: [
      { name: "Türkiye Unimog Bayi", location: "İstanbul", contact: "+90 212 123 4567" },
      { name: "Ankara Unimog Satış", location: "Ankara", contact: "+90 312 876 5432" }
    ],
    serviceCenters: [
      { name: "İstanbul Unimog Servis", location: "İstanbul", contact: "+90 212 345 6789" },
      { name: "İzmir Unimog Bakım", location: "İzmir", contact: "+90 232 987 6543" }
    ],
    spareParts: [
      { name: "Unimog Yedek Parça", location: "Bursa", website: "www.unimogyedekparca.com.tr" },
      { name: "Orijinal Unimog Parçaları", location: "Adana", website: "www.originalunimogparcalari.com.tr" }
    ],
    regulations: [
      { title: "Ağır Vasıta Yönetmeliği", description: "Türkiye'de ağır vasıtalar için düzenlemeler" },
      { title: "Arazi Araçları Tescil Kuralları", description: "Unimog gibi arazi araçları için tescil kuralları" }
    ]
  },
  AR: {
    dealerships: [
      { name: "Centro Unimog de Argentina", location: "Buenos Aires", contact: "+54 11 1234 5678" },
      { name: "Unimog Patagonia", location: "Bariloche", contact: "+54 294 876 5432" }
    ],
    serviceCenters: [
      { name: "Taller Especializado Unimog", location: "Córdoba", contact: "+54 351 234 5678" },
      { name: "Servicio Técnico Unimog", location: "Mendoza", contact: "+54 261 876 5432" }
    ],
    spareParts: [
      { name: "Repuestos Unimog Argentina", location: "Rosario", website: "www.repuestosunimog.com.ar" },
      { name: "Tienda de Partes Unimog", location: "Salta", website: "www.tiendaparteunimog.com.ar" }
    ],
    regulations: [
      { title: "Regulaciones para Vehículos Todo Terreno", description: "Normativa argentina para vehículos todo terreno" },
      { title: "Permisos Especiales para Unimog", description: "Trámites para circulación de Unimog en Argentina" }
    ]
  }
};

export function LocalizedResourcesList() {
  const { country } = useLocalization();
  const { t } = useTranslation();
  const [showGlobal, setShowGlobal] = useState(false);
  
  // Get resources for the current country
  const resources = countrySpecificResources[country] || countrySpecificResources.GB;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TranslatedH2 text={t('resources.title')} className="text-2xl font-bold" />
        
        <Tabs defaultValue="local" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="local" onClick={() => setShowGlobal(false)}>
              {t('Local Resources')}
            </TabsTrigger>
            <TabsTrigger value="global" onClick={() => setShowGlobal(true)}>
              {t('Global Resources')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {showGlobal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text={t('Global Unimog Documentation')} />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Official documentation and manuals for all Unimog models" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    <TranslatedText text="Mercedes-Benz Unimog Official Website" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    <TranslatedText text="Unimog Technical Specifications" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    <TranslatedText text="Unimog Historical Archives" />
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text={t('Community Resources')} />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Resources shared by the global Unimog community" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    <TranslatedText text="International Unimog Forum" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    <TranslatedText text="DIY Repair Guides" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    <TranslatedText text="Unimog Travel Route Collection" />
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text={t('resources.dealerships')} />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Authorized Unimog dealerships in your country" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resources.dealerships.map((item, index) => (
                  <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">
                      <TranslatedText text={item.name} />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <TranslatedText text={item.location} /> | {item.contact}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text={t('resources.service_centers')} />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Certified Unimog service centers" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resources.serviceCenters.map((item, index) => (
                  <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">
                      <TranslatedText text={item.name} />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <TranslatedText text={item.location} /> | {item.contact}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text={t('resources.spare_parts')} />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Where to buy genuine Unimog parts" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resources.spareParts.map((item, index) => (
                  <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">
                      <TranslatedText text={item.name} />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <TranslatedText text={item.location} /> | {item.website}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text={t('resources.regulations')} />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Local laws and regulations for Unimog vehicles" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resources.regulations.map((item, index) => (
                  <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-medium">
                      <TranslatedText text={item.title} />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <TranslatedText text={item.description} />
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
