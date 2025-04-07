
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">About Unimog Community Hub</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to the Unimog Community Hub, the premier online destination for Unimog enthusiasts, 
            owners, and adventurers. Our platform is dedicated to connecting the global Unimog community 
            and providing valuable resources for all things Unimog-related.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
          <p>
            Our mission is to create the most comprehensive and supportive community for Unimog owners 
            and enthusiasts. We aim to preserve and share knowledge, facilitate connections between 
            members, and promote the unique capabilities and adventures possible with these incredible 
            vehicles.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Knowledge Base</strong>: Access to manuals, guides, and community-contributed wisdom.</li>
            <li><strong>Community Forums</strong>: Connect with fellow Unimog enthusiasts from around the world.</li>
            <li><strong>Trip Planning</strong>: Discover and share off-road routes perfect for Unimogs.</li>
            <li><strong>Marketplace</strong>: Buy, sell, or trade Unimog parts, accessories, and vehicles.</li>
            <li><strong>Technical Support</strong>: Get help with maintenance, repairs, and modifications.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
          <p>
            Have questions, suggestions, or need assistance? Contact our team at 
            <a href="mailto:info@unimogcommunityhub.com" className="text-primary ml-1">
              info@unimogcommunityhub.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
