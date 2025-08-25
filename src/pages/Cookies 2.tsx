
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const Cookies = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-green dark:prose-invert max-w-none">
            <p>
              This Cookie Policy explains how Unimog Hub uses cookies and similar technologies to recognize you when you visit our website. 
              It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            
            <Separator className="my-8" />
            
            <h2>1. What are cookies?</h2>
            <p>
              Cookies are small data files placed on your device when you visit a website. Cookies serve different purposes, 
              such as allowing websites to remember your preferences and settings, enabling you to sign in, providing personalized 
              content, and analyzing website traffic.
            </p>
            <p>
              Cookies set by the website owner (in this case, Unimog Hub) are called "first-party cookies." Cookies set by parties 
              other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or 
              functionality to be provided on or through the website, such as advertising, interactive content, and analytics.
            </p>
            
            <h2>2. Types of cookies we use</h2>
            <p>
              We use the following types of cookies:
            </p>
            <ul>
              <li>
                <strong>Essential cookies:</strong> These cookies are necessary for the website to function properly. They enable core 
                functionality such as security, network management, and account access. You may not disable these cookies in our settings, 
                but you can block them through your browser settings.
              </li>
              <li>
                <strong>Performance cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and 
                improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move 
                around the site.
              </li>
              <li>
                <strong>Functionality cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. 
                They may be set by us or by third-party providers whose services we have added to our pages.
              </li>
              <li>
                <strong>Targeting cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by 
                those companies to build a profile of your interests and show you relevant advertisements on other sites.
              </li>
            </ul>
            
            <h2>3. How we use cookies</h2>
            <p>
              We use cookies for the following purposes:
            </p>
            <ul>
              <li>To authenticate users and prevent fraudulent use of user accounts</li>
              <li>To remember information about your preferences and settings</li>
              <li>To understand and save your preferences for future visits</li>
              <li>To keep track of advertisements and understand their effectiveness</li>
              <li>To compile aggregate data about site traffic and site interactions</li>
              <li>To analyze trends, administer the website, track user movements, and gather demographic information</li>
            </ul>
            
            <h2>4. Your choices regarding cookies</h2>
            <p>
              If you prefer to avoid the use of cookies on our website, you can turn off cookies in your browser settings. 
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, 
              including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.
            </p>
            <p>
              Please note that if you choose to disable cookies, some areas of this website may not work properly.
            </p>
            
            <h2>5. Third-party cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
              deliver advertisements, and so on. These cookies may include:
            </p>
            <ul>
              <li>Google Analytics</li>
              <li>Social Media cookies (Facebook, Twitter, LinkedIn)</li>
              <li>Advertising cookies</li>
              <li>Payment processor cookies</li>
            </ul>
            
            <h2>6. Changes to this Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, 
              legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and 
              related technologies.
            </p>
            
            <h2>7. Contact us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at cookies@unimoghub.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;
