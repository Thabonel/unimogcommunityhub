
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const Terms = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-green dark:prose-invert max-w-none">
            <p>
              Welcome to Unimog Hub. These Terms of Service ("Terms") govern your use of our website, services, 
              and platform (collectively, the "Service"). By accessing or using our Service, you agree to be bound 
              by these Terms.
            </p>
            
            <Separator className="my-8" />
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, you agree to these Terms. If you disagree with any part of the terms, 
              you may not access the Service.
            </p>
            
            <h2>2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. 
              You are responsible for safeguarding the password used to access the Service and for any activities or 
              actions under your password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any 
              breach of security or unauthorized use of your account.
            </p>
            
            <h2>3. User Content</h2>
            <p>
              Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, 
              videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, 
              including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours and/or you have 
              the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the 
              posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, 
              contract rights, or any other rights of any person.
            </p>
            
            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality are and will 
              remain the exclusive property of Unimog Hub and its licensors. The Service is protected by copyright, trademark, and 
              other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior 
              written consent of Unimog Hub.
            </p>
            
            <h2>5. Marketplace Transactions</h2>
            <p>
              Unimog Hub provides a platform for users to buy and sell Unimog-related goods and services. We are not a party to any 
              transactions between users. As such, we have no control over the quality, safety, morality or legality of any aspect 
              of the items listed, the truth or accuracy of the listings, or the ability of sellers to sell items or the ability 
              of buyers to pay for items.
            </p>
            <p>
              We do not pre-screen content or information provided by users. We are not involved in the actual transaction between 
              buyers and sellers. As a result, we have no control over the quality, safety, or legality of the items advertised, 
              the truth or accuracy of the listings, or the ability of sellers to sell items or the ability of buyers to buy items.
            </p>
            
            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall Unimog Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for 
              any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access 
              or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the 
              Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
            </p>
            
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or 
              use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree 
              to the new terms, please stop using the Service.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@unimoghub.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
