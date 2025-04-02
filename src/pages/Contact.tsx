
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import { sendEmail } from '@/utils/emailUtils';

const Contact = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await sendEmail({
        to: 'info@unimogcommunityhub.com',
        subject: `Contact Form: ${formState.subject}`,
        message: `
Name: ${formState.name}
Email: ${formState.email}

${formState.message}
        `,
        html: `
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> ${formState.name} (${formState.email})</p>
<p><strong>Subject:</strong> ${formState.subject}</p>
<h3>Message:</h3>
<p>${formState.message.replace(/\n/g, '<br>')}</p>
        `,
        type: 'info'
      });
      
      if (error) throw error;
      
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout isLoggedIn={false}>
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-unimog-800 dark:text-unimog-200">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="offroad-card">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-muted-foreground">info@unimogcommunityhub.com</p>
              </CardContent>
            </Card>
            
            <Card className="offroad-card">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </CardContent>
            </Card>
            
            <Card className="offroad-card">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Location</h3>
                <p className="text-muted-foreground">Munich, Germany</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="offroad-card">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="John Doe" 
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input 
                      id="email"
                      name="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input 
                    id="subject"
                    name="subject" 
                    placeholder="How can we help you?" 
                    value={formState.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message"
                    name="message" 
                    placeholder="Your message here..." 
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-primary w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
