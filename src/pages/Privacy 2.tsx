
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const Privacy = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-green dark:prose-invert max-w-none">
            <p>
              At Unimog Hub, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our website or services.
            </p>
            
            <Separator className="my-8" />
            
            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you:
            </p>
            <ul>
              <li>Create an account</li>
              <li>Complete your profile</li>
              <li>Post content or send messages</li>
              <li>Participate in community discussions</li>
              <li>Contact our support team</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p>
              This information may include your name, email address, profile picture, location, vehicle information, 
              and any other details you choose to provide.
            </p>
            
            <h2>2. Automatically Collected Information</h2>
            <p>
              When you access or use our services, we automatically collect certain information about your device and usage, including:
            </p>
            <ul>
              <li>Device information (e.g., IP address, browser type, operating system)</li>
              <li>Usage data (e.g., pages visited, time spent on the platform, features used)</li>
              <li>Location information (with your permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about the platform</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>4. Sharing of Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Other users, as part of your profile and content you post (based on your privacy settings)</li>
              <li>Service providers who perform services on our behalf</li>
              <li>Legal authorities when required by law</li>
              <li>In connection with a merger, sale, or acquisition of our business</li>
            </ul>
            <p>
              We never sell your personal data to third parties for marketing purposes.
            </p>
            
            <h2>5. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have rights regarding your personal data, including:
            </p>
            <ul>
              <li>Accessing and updating your information</li>
              <li>Deleting your account and associated data</li>
              <li>Restricting or objecting to processing</li>
              <li>Data portability</li>
              <li>Withdrawing consent</li>
              <li>Opting out of marketing communications</li>
            </ul>
            <p>
              You can exercise many of these rights through your account settings or by contacting us directly.
            </p>
            
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet 
              or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>7. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence, where 
              data protection laws may differ. We ensure appropriate safeguards are in place to protect your information when 
              transferred internationally.
            </p>
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information 
              from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.
            </p>
            
            <h2>9. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
              on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@unimoghub.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
