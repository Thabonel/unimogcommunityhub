
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';

const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Listing Details</h1>
        <p className="text-lg mb-4">
          Viewing listing ID: {id}
        </p>
      </div>
    </Layout>
  );
};

export default ListingDetailPage;
