
import React from 'react';
import Layout from '@/components/Layout';

const ProfilePage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <p className="text-lg mb-4">
          Manage your profile information and vehicle details.
        </p>
      </div>
    </Layout>
  );
};

export default ProfilePage;
