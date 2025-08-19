
import React from 'react';
import Layout from '@/components/Layout';

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="mb-6">
          Have questions or feedback about our Unimog travel planning service? We'd love to hear from you!
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Your Name</label>
                <input type="text" id="name" className="w-full p-2 border rounded-md" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Your Email</label>
                <input type="email" id="email" className="w-full p-2 border rounded-md" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Message</label>
                <textarea id="message" rows={4} className="w-full p-2 border rounded-md" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90">
                Send Message
              </button>
            </form>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <p><strong>Email:</strong> info@unimogtrips.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Unimog Street, Adventure City, AC 12345</p>
              <p className="pt-4">Our support team is available Monday through Friday, 9am to 5pm CET.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
