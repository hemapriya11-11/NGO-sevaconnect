import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Building2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(false);
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      login(data, data.token);

      const from = location.state?.from?.pathname || (
        data.role === 'admin' ? '/admin' : 
        data.role === 'ngo' ? '/ngo/dashboard' : 
        '/dashboard/user'
      );
      
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (forgotPasswordStep === 'email') {
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetData.email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
        setForgotPasswordStep('otp');
      } else if (forgotPasswordStep === 'otp') {
        if (!resetData.otp || !resetData.newPassword) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: resetData.email,
            otp: resetData.otp,
            newPassword: resetData.newPassword
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to reset password');
        
        setForgotPasswordStep(false);
        setFormData({ ...formData, email: resetData.email, password: '' });
        alert('Password reset successfully. You can now log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] section-padding flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md animate-fade-in card-elevated !rounded-2xl border border-border overflow-hidden">
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue to SevaConnect</p>
          </div>

          {!forgotPasswordStep ? (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-foreground">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setForgotPasswordStep('email'); setError(''); setResetData({...resetData, email: formData.email}); }} 
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full btn-hero flex items-center justify-center gap-2 py-3.5 mt-2">
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Reset Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {forgotPasswordStep === 'email' ? "Enter your email to receive an OTP" : "Enter OTP and your new password"}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              {forgotPasswordStep === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      value={resetData.email}
                      onChange={(e) => setResetData({...resetData, email: e.target.value})}
                      className="input-field pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full btn-hero flex items-center justify-center gap-2 py-3.5 mt-4">
                    <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={resetData.otp}
                      onChange={(e) => setResetData({...resetData, otp: e.target.value})}
                      className="input-field py-3 text-center tracking-[0.5em] text-lg font-semibold"
                      placeholder="------"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <input
                        type="password"
                        value={resetData.newPassword}
                        onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                        className="input-field pl-10"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full btn-hero flex items-center justify-center gap-2 py-3.5 mt-2">
                    <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <button 
                type="button" 
                onClick={() => setForgotPasswordStep(false)} 
                className="w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                Back to Login
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
