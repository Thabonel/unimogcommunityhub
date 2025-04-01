
import { useState } from 'react';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/unimog/PageHeader';
import { UnimogTabs } from '@/components/unimog/UnimogTabs';

const UnimogU1700L = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const militarySpecs = [
    { label: "Engine", value: "OM352A 5.7L inline-6 diesel" },
    { label: "Power Output", value: "124-168 hp (92-125 kW)" },
    { label: "Transmission", value: "UG 3/40 - 8 forward, 8 reverse gears" },
    { label: "Gross Vehicle Weight", value: "7.5-8.5 tonnes" },
    { label: "Fording Depth", value: "Up to 1.2 meters (without preparation)" },
    { label: "Approach/Departure Angle", value: "44°/45°" },
    { label: "Ground Clearance", value: "450 mm" },
    { label: "Wheelbase", value: "3,250-3,850 mm" },
    { label: "Tires", value: "12.5R20 or 365/85R20" },
    { label: "Production Period", value: "1980s-1990s" },
  ];

  const commonIssues = [
    { title: "Portal Axle Maintenance", description: "Regular inspection of portal gears and oil levels is essential. Military models often have high mileage in extreme conditions." },
    { title: "Fuel System Issues", description: "Diesel injector pumps may require rebuilding after years of service, especially in ex-military vehicles that might have sat unused." },
    { title: "Brake System", description: "Air brake systems need special attention, particularly on models converted from military use to civilian applications." },
    { title: "Electrical System", description: "Military wiring harnesses can be complex and may have been modified. Complete documentation helps significantly with troubleshooting." },
    { title: "Transfer Case Leaks", description: "Common in older U1700L models, particularly those that have seen heavy off-road use." },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <PageHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <UnimogTabs 
          militarySpecs={militarySpecs}
          commonIssues={commonIssues}
          searchQuery={searchQuery}
        />
      </div>
    </Layout>
  );
};

export default UnimogU1700L;
