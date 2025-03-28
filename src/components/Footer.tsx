
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 text-unimog-800 dark:text-unimog-200">
              <img src="/placeholder.svg" alt="Logo" className="w-8 h-8" />
              Unimog Hub
            </Link>
            <p className="text-sm text-muted-foreground">
              The ultimate community for Unimog owners and enthusiasts. Join us to explore, learn, and connect.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-unimog-800 dark:text-unimog-200">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-muted-foreground hover:text-foreground transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/trips" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Forums
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-unimog-800 dark:text-unimog-200">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-unimog-800 dark:text-unimog-200">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Unimog Community Hub. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </a>
            <a href="mailto:info@unimoghub.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail size={20} />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
