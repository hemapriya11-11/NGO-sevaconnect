import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Globe, Clock, Calendar, 
  ArrowLeft, CheckCircle, Shield, Building2, 
  Users, Heart, ExternalLink, Loader2, IndianRupee
} from 'lucide-react';
import { categories } from '../data/mockData';
import { toast } from 'sonner';

const NGOProfile = () => {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [campaigns, setCampaigns] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestForm, setRequestForm] = useState({
    details: '',
    phone: '',
    email: ''
  });
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        const response = await fetch(`/api/ngos/${id}`);
        if (!response.ok) throw new Error('NGO not found');
        const data = await response.json();
        setNgo(data);
      } catch (error) {
        console.error('Failed to fetch NGO details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }
    };

    fetchNGO();
    fetchCampaigns();

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [id]);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [files, setFiles] = useState([]);

  const handleSendOtp = () => {
    if (!requestForm.phone) {
      toast.error('Please enter your phone number first');
      return;
    }
    setOtpSent(true);
    toast.success('OTP sent to ' + requestForm.phone + ' (Simulated: 1234)');
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      setIsPhoneVerified(true);
      setShowOtp(false);
      toast.success('Phone verified successfully!');
    } else {
      toast.error('Invalid OTP. Use 1234 for testing.');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to submit a request');
      return;
    }

    if (!isPhoneVerified) {
      setShowOtp(true);
      return;
    }

    if (!requestForm.details || !requestForm.phone) {
      toast.error('Please fill in your request details and contact phone');
      return;
    }

    setRequestLoading(true);
    try {
      const formData = new FormData();
      formData.append('ngoId', id);
      formData.append('requestDetails', JSON.stringify({ message: requestForm.details }));
      formData.append('phone', requestForm.phone);
      formData.append('email', requestForm.email);
      
      files.forEach((file) => {
        formData.append('supportingFiles', file);
      });

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Your help request has been submitted successfully!');
        setRequestForm({ details: '', phone: '', email: '' });
        setFiles([]);
        setActiveTab('about');
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to make a donation');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create Order
      const res = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(donationAmount), ngoId: id })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_YourKeyHere', // This should ideally come from backend or config
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SevaConnect Donation',
        description: `Donation to ${ngo.ngoName}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/donations/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.success('Donation successful! Thank you for your support.');
              setDonationAmount('');
            } else {
              toast.error(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            toast.error('Error verifying payment');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#0D9488'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatedDonate = async () => {
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to make a donation');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/donations/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(donationAmount), ngoId: id })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Demo Donation Successful! Simulated ₹${donationAmount} contribution.`);
        setDonationAmount('');
      } else {
        throw new Error(data.error || 'Fake donation failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding text-center flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading details...</p>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="section-padding text-center">
        <h1 className="font-display text-2xl font-bold mb-4">NGO Not Found</h1>
        <Link to="/ngos" className="text-primary hover:underline">
          Browse all NGOs
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === ngo.category);

  return (
    <div className="animate-fade-in">
      {/* Header with Image */}
      <section className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img 
          src={ngo.image || category?.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200'} 
          alt={ngo.ngoName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/ngos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 backdrop-blur-sm text-foreground font-medium hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to NGOs</span>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-6 right-6 flex gap-2">
          {ngo.status === 'approved' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success text-success-foreground text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Verified
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium">
            {category?.icon} {category?.name}
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background -mt-16 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="card-elevated p-6 flex items-center gap-4 border-l-4 border-primary">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">People Helped</p>
                    <p className="text-2xl font-bold text-foreground">{ngo.totalPeopleHelped || 0}</p>
                  </div>
                </div>
                <div className="card-elevated p-6 flex items-center gap-4 border-l-4 border-secondary">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Campaigns</p>
                    <p className="text-2xl font-bold text-foreground">{ngo.totalCampaigns || 0}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border mb-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-4 font-medium transition-all relative ${
                    activeTab === 'about' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  About Organization
                  {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`px-6 py-4 font-medium transition-all relative ${
                    activeTab === 'campaigns' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Impact Campaigns
                  {activeTab === 'campaigns' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                  onClick={() => setActiveTab('request')}
                  className={`px-6 py-4 font-medium transition-all relative ${
                    activeTab === 'request' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Request Help
                  {activeTab === 'request' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              </div>

              <div className="card-elevated p-6 sm:p-8 mb-8">
                {activeTab === 'about' && (
                  <div className="animate-fade-in">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                      {ngo.ngoName}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-muted-foreground mb-6">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Est. {ngo.yearEstablished || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {ngo.areasOfOperation?.join(', ') || 'Tamil Nadu'}
                      </span>
                    </div>

                    <div className="prose max-w-none">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Our Mission</h3>
                      <p className="text-muted-foreground mb-6">{ngo.mission || 'To serve the community and create a positive impact through dedicated service and support.'}</p>

                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">About Us</h3>
                      <p className="text-muted-foreground mb-6">{ngo.description}</p>

                      <h3 className="font-display text-lg font-semibold text-foreground mb-3">Services We Offer</h3>
                      <div className="flex flex-wrap gap-2">
                        {ngo.services?.map((service, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium"
                          >
                            {service}
                          </span>
                        )) || (
                          <p className="text-muted-foreground text-sm italic">General social services and community support.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'campaigns' && (
                  <div className="animate-fade-in space-y-6">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Campaigns</h2>
                    {campaigns.length > 0 ? (
                      campaigns.map(campaign => (
                        <div key={campaign._id} className="p-5 rounded-2xl bg-accent/30 border border-border flex flex-col sm:flex-row gap-5 hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-lg text-foreground">{campaign.title}</h4>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                campaign.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                              }`}>
                                {campaign.status}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{campaign.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(campaign.date).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {campaign.location}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">No campaigns found for this NGO.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'request' && (
                  <div className="animate-fade-in">
                    <div className="max-w-xl">
                      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Request Help</h2>
                      <p className="text-muted-foreground mb-8">
                        If you or someone you know needs support from this organization, please fill out the request form below. Our team will review your application and contact you offline.
                      </p>

                      <form onSubmit={handleRequestSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Request Details</label>
                          <textarea
                            value={requestForm.details}
                            onChange={(e) => setRequestForm({...requestForm, details: e.target.value})}
                            placeholder="Please describe your situation and the kind of help you need..."
                            className="input-field min-h-[150px] resize-none"
                            required
                          />
                        </div>

                        {showOtp ? (
                          <div className="p-6 rounded-2xl bg-primary/10 border-2 border-primary/20 animate-slide-up mb-6">
                            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                              <Shield className="w-5 h-5 text-primary" />
                              Verify Your Identity
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              We've sent a 4-digit code to {requestForm.phone}. Please enter it below to proceed.
                            </p>
                            <div className="flex gap-4">
                              <input
                                type="text"
                                maxLength="4"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="0000"
                                className="input-field text-center font-bold tracking-[1em] text-lg w-32"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="btn-hero px-8"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              <div className="relative">
                                <label className="block text-sm font-medium text-foreground mb-2">Contact Phone</label>
                                <div className="relative">
                                  <input
                                    type="tel"
                                    value={requestForm.phone}
                                    onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                                    placeholder="+91 XXXXX XXXXX"
                                    className={`input-field ${isPhoneVerified ? 'border-success bg-success/5 pr-12' : ''}`}
                                    required
                                    disabled={isPhoneVerified}
                                  />
                                  {isPhoneVerified ? (
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
                                  ) : (
                                    <button 
                                      type="button" 
                                      onClick={handleSendOtp}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg"
                                    >
                                      Verify
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Email (Optional)</label>
                                <input
                                  type="email"
                                  value={requestForm.email}
                                  onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                                  placeholder="your@email.com"
                                  className="input-field"
                                />
                              </div>
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Supporting Documents (Optional)
                                <span className="block text-xs font-normal text-muted-foreground mt-1">Upload proof of situation (Medicine bills, school ID, etc.) . Images or PDFs accepted.</span>
                              </label>
                              <input
                                type="file"
                                multiple
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                              />
                              {files.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                   {files.map((file, i) => (
                                     <span key={i} className="px-2 py-1 bg-accent rounded text-[10px] truncate max-w-[150px]">{file.name}</span>
                                   ))}
                                </div>
                              )}
                            </div>

                            <button 
                              type="submit" 
                              disabled={requestLoading}
                              className="w-full btn-hero flex items-center justify-center gap-2 py-4 shadow-teal"
                            >
                              {requestLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5 fill-current" />}
                              <span>{requestLoading ? 'Submitting...' : isPhoneVerified ? 'Submit Request' : 'Verify & Submit'}</span>
                            </button>
                          </>
                        )}
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Documents (Move down or keep as section) */}
              {activeTab === 'about' && (
                <div className="card-elevated p-6 sm:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Verification Status
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      {ngo.documents?.registrationCertificate ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted" />
                      )}
                      <span className="text-sm text-muted-foreground">Registration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ngo.documents?.panCard ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted" />
                      )}
                      <span className="text-sm text-muted-foreground">PAN Card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ngo.documents?.certificate80G ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted" />
                      )}
                      <span className="text-sm text-muted-foreground">80G Cert</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ngo.documents?.certificate12A ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted" />
                      )}
                      <span className="text-sm text-muted-foreground">12A Cert</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact Info */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Contact & Visit
                  </h3>
                </div>

                {/* Offline Help Banner */}
                <div className="bg-accent rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm mb-1">
                        Need Offline Help?
                      </p>
                      <p className="text-muted-foreground text-sm">
                        You can visit or contact this NGO directly for in-person support.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Visit Us At</p>
                      <p className="font-medium text-foreground">{ngo.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Call Us</p>
                      <a 
                        href={`tel:${ngo.phone}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {ngo.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email Us</p>
                      <a 
                        href={`mailto:${ngo.email}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {ngo.email}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Working Hours</p>
                      <p className="font-medium text-foreground">{ngo.workingHours}</p>
                    </div>
                  </div>

                  {/* Website */}
                  {ngo.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Website</p>
                        <a 
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Donation Section */}
                <div className="mt-8 border-t border-border pt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Make a Donation
                    </h3>
                  </div>
                  
                  {ngo.status === 'approved' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                          Enter Amount (INR)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Test Mode</span>
                          <button 
                            onClick={() => setIsTestMode(!isTestMode)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${isTestMode ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${isTestMode ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="input-field pl-10"
                            placeholder="e.g., 500"
                            min="1"
                          />
                        </div>
                        
                        <button
                          onClick={isTestMode ? handleSimulatedDonate : handleDonate}
                          disabled={isProcessing}
                          className={`w-full btn-hero flex items-center justify-center gap-2 py-4 shadow-teal ${isTestMode ? 'bg-secondary hover:bg-secondary/90 shadow-secondary/20' : ''}`}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Heart className={`w-5 h-5 ${isTestMode ? '' : 'fill-current'}`} />
                          )}
                          <span>
                            {isProcessing ? 'Processing...' : isTestMode ? 'Simulate Donation' : 'Donate Now'}
                          </span>
                        </button>
                        
                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider">
                          {isTestMode ? 'Demo Mode • No Real Money Involved' : 'Secure SSL Encryption • Razorpay Payments'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-xl border border-border text-center">
                      <p className="text-sm text-muted-foreground">
                        Donations are currently disabled as this organization is undergoing verification.
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 space-y-3">
                  <a
                    href={`tel:${ngo.phone}`}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(ngo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-border text-muted-foreground font-semibold hover:bg-accent transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NGOProfile;
