import Layout from '@/components/Layout';
import { SupporterTierSelector } from '@/components/supporter/SupporterTierSelector';

export default function SupporterSignup() {
  return (
    <Layout>
      <div className="container py-12">
        <SupporterTierSelector />
      </div>
    </Layout>
  );
}