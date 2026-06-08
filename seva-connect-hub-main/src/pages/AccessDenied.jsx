import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center p-8 max-w-md bg-background rounded-2xl shadow-sm border border-border">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You do not have permission to view this page. If you believe this is an error, please contact support.
        </p>
        <Link to="/" className="btn-hero px-6 py-3 rounded-lg flex items-center justify-center w-full">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
