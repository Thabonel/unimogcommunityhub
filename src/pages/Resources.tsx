
import Layout from '@/components/Layout';
import { LocalizedResourcesList } from '@/components/resources/LocalizedResourcesList';

const Resources = () => {
  return (
    <Layout>
      <div className="container py-10">
        <LocalizedResourcesList />
      </div>
    </Layout>
  );
};

export default Resources;
