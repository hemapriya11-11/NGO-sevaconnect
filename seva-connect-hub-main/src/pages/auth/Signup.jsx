import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, Phone, FileText, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // user, ngo
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Common validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain a number');
      return;
    }

    // Role-specific validation
    if (role === 'ngo') {
      if (!formData.phone || !formData.description) {
        setError('Please fill in organization contact details and description');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (!otpStep) {
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
        setOtpStep(true);
        setError('');
      } else {
        if (!otp) {
          setError('Please enter OTP');
          setIsLoading(false);
          return;
        }
        const payload = {
          ...formData,
          role: role,
          otp
        };
        if (role === 'user') {
          delete payload.phone;
          delete payload.description;
        }
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] section-padding flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-lg my-8 animate-fade-in card-elevated !rounded-2xl border border-border overflow-hidden">
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create an Account</h1>
            <p className="text-muted-foreground">Join the SevaConnect community</p>
          </div>

          <div className="flex p-1 bg-muted rounded-xl mb-8">
            <button
              type="button"
              onClick={() => { setRole('user'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'user' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              User
            </button>
            <button
              type="button"
              onClick={() => { setRole('ngo'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'ngo' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 className="w-4 h-4" />
              NGO
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            {!otpStep ? (
              <>
                <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {role === 'user' ? 'Full Name' : 'Organization Name'} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {role === 'user' ? (
                    <User className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder={role === 'user' ? "John Doe" : "Hope Foundation"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
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
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            {role === 'ngo' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contact Phone *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Short Description *</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field pl-10 min-h-[100px] py-3"
                      placeholder="Briefly describe what your organization does..."
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
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
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Must be at least 8 characters long and include a number.
              </p>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-hero flex items-center justify-center gap-2 py-3.5 mt-2">
              <span>{isLoading ? 'Sending OTP...' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            </>
            ) : (
              <div className="animate-fade-in space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Enter Verification OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(''); }}
                    className="input-field py-3 text-center tracking-[0.5em] text-lg font-semibold"
                    placeholder="------"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Please enter the 6-digit OTP sent to {formData.email}
                  </p>
                </div>
                <button type="submit" disabled={isLoading} className="w-full btn-hero flex items-center justify-center gap-2 py-3.5 mt-2">
                  <span>{isLoading ? 'Creating Account...' : 'Verify & Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setOtpStep(false)} 
                  className="w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  Back to Details
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
