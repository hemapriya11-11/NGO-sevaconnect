import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center section-padding animate-fade-in">
      <div className="text-center">
        <div className="text-8xl font-display font-bold text-primary/20 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/ngos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Find NGOs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
