import { useAuth } from '../context/AuthContext';
import { Clock, XCircle, CheckCircle, ArrowRight, RefreshCcw, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NGOStatus = () => {
  const { ngoData, logout } = useAuth();
  const navigate = useNavigate();

  if (!ngoData) return null;

  const { status, registrationCompleted, rejectionReason } = ngoData;

  const handleResubmit = () => {
    // Logic to redirect back to registration with pre-filled or editable data
    navigate('/ngo/register');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-background border border-border shadow-2xl !rounded-3xl p-8 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Pending State */}
        {status === 'pending' && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-warning/10 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-12 h-12 text-warning" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-foreground">Under Review</h2>
              <p className="text-muted-foreground">
                Your application has been received and is currently being reviewed by our administration team.
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 border border-border rounded-2xl flex items-center gap-3 text-sm text-muted-foreground text-left">
              <Clock className="w-5 h-5 text-warning shrink-0" />
              <p>Typical review time is 2-3 business days. We will notify you via email once a decision is made.</p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full btn-hero flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Check for Updates
              </button>
              <button 
                onClick={logout} 
                className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Rejected State */}
        {status === 'rejected' && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-foreground">Application Rejected</h2>
              <p className="text-muted-foreground">
                We're sorry, but your application for NGO registration has been rejected.
              </p>
            </div>

            {rejectionReason && (
              <div className="p-5 bg-destructive/5 border border-destructive/20 rounded-2xl text-left">
                <span className="text-xs font-bold text-destructive uppercase tracking-wider block mb-1">Reason for rejection:</span>
                <p className="text-sm text-foreground/80 leading-relaxed">{rejectionReason}</p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={handleResubmit} 
                className="w-full btn-hero bg-destructive hover:bg-destructive/90 text-white flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Edit & Resubmit Application
              </button>
              <button 
                onClick={logout} 
                className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Approved State (Wait, protector should redirect, but just in case) */}
        {status === 'approved' && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-foreground">Account Approved!</h2>
              <p className="text-muted-foreground">
                Congratulations! Your NGO profile has been verified. You can now access all features.
              </p>
            </div>
            <Link to="/dashboard/ngo" className="w-full btn-hero flex items-center justify-center gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default NGOStatus;
