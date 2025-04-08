
import React from 'react';
import Layout from '@/components/Layout';
import MapContainer from '@/components/map/MapContainer';

const MapPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Interactive Map</h1>
        <MapContainer height="600px" />
      </div>
    </Layout>
  );
};

export default MapPage;
