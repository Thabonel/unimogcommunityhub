
import React from 'react';
import Layout from '@/components/Layout';

const HomePage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Unimog Community</h1>
        <p className="text-lg mb-4">
          Your central hub for all things Unimog - connect with other owners, plan trips, 
          access technical resources, and more.
        </p>
      </div>
    </Layout>
  );
};

export default HomePage;
