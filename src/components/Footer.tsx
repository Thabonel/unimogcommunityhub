
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';
import { Card } from './ui/card';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-muted/60 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 text-unimog-800 dark:text-unimog-200 hover:opacity-90 transition-opacity">
              <img src="/placeholder.svg" alt="Logo" className="w-10 h-10" />
              <span className="tracking-tight">Unimog Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The ultimate community for Unimog owners and enthusiasts. Join us to explore, learn, and connect with other off-road adventurers.
            </p>
          </div>
          
          <div className="md:ml-auto">
            <h3 className="font-medium mb-4 text-lg text-unimog-800 dark:text-unimog-200">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">Pricing</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">Careers</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-lg text-unimog-800 dark:text-unimog-200">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
                  <span className="hover:translate-x-1 transition-transform">Cookie Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6 opacity-30" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Unimog Community Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
