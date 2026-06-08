import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Heart className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-bold">NGO</span>
                <span className="font-display text-xl font-bold text-secondary"> SevaConnect</span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed">
              Connecting people with verified NGOs for real-world assistance. 
              Your bridge to social impact and community support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/ngos" className="text-primary-foreground/80 hover:text-secondary transition-colors">Find NGOs</Link></li>
              <li><Link to="/register-ngo" className="text-primary-foreground/80 hover:text-secondary transition-colors">Register Your NGO</Link></li>
              <li><Link to="/ngos?category=education" className="text-primary-foreground/80 hover:text-secondary transition-colors">Education NGOs</Link></li>
              <li><Link to="/ngos?category=health" className="text-primary-foreground/80 hover:text-secondary transition-colors">Health NGOs</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/ngos?category=women" className="text-primary-foreground/80 hover:text-secondary transition-colors">Women Empowerment</Link></li>
              <li><Link to="/ngos?category=children" className="text-primary-foreground/80 hover:text-secondary transition-colors">Child Welfare</Link></li>
              <li><Link to="/ngos?category=environment" className="text-primary-foreground/80 hover:text-secondary transition-colors">Environment</Link></li>
              <li><Link to="/ngos?category=elderly" className="text-primary-foreground/80 hover:text-secondary transition-colors">Elderly Care</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-5 h-5 text-secondary" />
                <span>support@sevaconnect.org</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-secondary" />
                <span>+91 1800 123 4567</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <span>123 Social Impact Road,<br />Mumbai, Maharashtra 400001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 NGO SevaConnect. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-secondary" /> for social good
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
