import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, FileText, CheckCircle, ArrowRight, ArrowLeft,
  Upload, Phone, Mail, MapPin, Clock, Globe
} from 'lucide-react';
import { categories, locations } from '../data/mockData';

const steps = [
  { id: 1, name: 'Basic Details', icon: Building2 },
  { id: 2, name: 'Contact Info', icon: Phone },
  { id: 3, name: 'Documents', icon: FileText },
  { id: 4, name: 'Declaration', icon: CheckCircle },
];

const NGORegistration = () => {
  const { user, refreshNgoData } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Details
    ngoName: '',
    yearEstablished: '',
    category: '',
    mission: '',
    description: '',
    areasOfOperation: [],

    // Contact Info
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    website: '',
    socialMedia: '',
    workingHours: '',

    // Documents
    registrationCertificate: null,
    trustDeed: null,
    panCard: null,
    certificate80G: null,
    certificate12A: null,
    identityProof: null,
    bankDetails: null,

    // Declaration
    declarationAccepted: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => {
      const areas = prev.areasOfOperation.includes(location)
        ? prev.areasOfOperation.filter(l => l !== location)
        : [...prev.areasOfOperation, location];
      return { ...prev, areasOfOperation: areas };
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.declarationAccepted) {
      toast.error('Please accept the declaration to proceed');
      return;
    }

    const toastId = toast.loading('Submitting application...');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        if (key === 'areasOfOperation' && Array.isArray(formData[key])) {
          data.append(key, formData[key].join(','));
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ngos/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully! You will hear from us soon.', { id: toastId });
        await refreshNgoData();
        navigate('/ngo/status');
      } else {
        toast.error(result.error || 'Submission failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error. Please try again.', { id: toastId });
      console.error(error);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-secondary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
              Register Your NGO
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Join SevaConnect and help more people find your organization for support.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-card border-b border-border py-6">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-success text-success-foreground' 
                        : isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block ${
                      isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-24 h-1 mx-2 rounded-full transition-colors ${
                      isCompleted ? 'bg-success' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="card-elevated p-6 sm:p-8 animate-fade-in">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Basic NGO Details
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      NGO Name *
                    </label>
                    <input
                      type="text"
                      name="ngoName"
                      value={formData.ngoName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your NGO's registered name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Year of Establishment *
                      </label>
                      <input
                        type="number"
                        name="yearEstablished"
                        value={formData.yearEstablished}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., 2010"
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mission Statement *
                    </label>
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleInputChange}
                      className="input-field min-h-24"
                      placeholder="Briefly describe your NGO's mission (2-3 sentences)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field min-h-32"
                      placeholder="Provide a detailed description of your NGO, its history, and work"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Areas of Operation *
                    </label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select all regions where your NGO operates
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {locations.map(location => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            formData.areasOfOperation.includes(location)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Info */}
            {currentStep === 2 && (
              <div className="card-elevated p-6 sm:p-8 animate-fade-in">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Contact & Offline Help Details
                </h2>
                <p className="text-muted-foreground mb-6">
                  This information will be displayed publicly so people can visit or contact you directly.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Office Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Full address for people to visit your office"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Mumbai"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Maharashtra"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email ID *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="contact@yourngo.org"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Office Working Hours *
                    </label>
                    <input
                      type="text"
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Mon-Sat: 9:00 AM - 6:00 PM"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Website (optional)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="https://www.yourngo.org"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Social Media Links (optional)
                      </label>
                      <input
                        type="text"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Facebook, Instagram, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="card-elevated p-6 sm:p-8 animate-fade-in">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Legal & Verification Documents
                </h2>
                <p className="text-muted-foreground mb-6">
                  Upload documents for admin verification. These will not be shown publicly.
                </p>

                <div className="space-y-5">
                  {/* Required Documents */}
                  <div className="p-4 bg-accent/50 rounded-xl mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Required Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      The following documents are mandatory for verification.
                    </p>
                  </div>

                  <FileUploadField
                    label="NGO Registration Certificate *"
                    name="registrationCertificate"
                    value={formData.registrationCertificate}
                    onChange={handleInputChange}
                    required
                  />

                  <FileUploadField
                    label="Trust Deed / Society Registration / Section 8 Certificate *"
                    name="trustDeed"
                    value={formData.trustDeed}
                    onChange={handleInputChange}
                    required
                  />

                  <FileUploadField
                    label="PAN Card of NGO *"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleInputChange}
                    required
                  />

                  {/* Optional Documents */}
                  <div className="p-4 bg-muted rounded-xl mb-4 mt-8">
                    <h3 className="font-semibold text-foreground mb-2">Optional Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      These help build trust but are not mandatory.
                    </p>
                  </div>

                  <FileUploadField
                    label="80G Certificate (if available)"
                    name="certificate80G"
                    value={formData.certificate80G}
                    onChange={handleInputChange}
                  />

                  <FileUploadField
                    label="12A Certificate (if available)"
                    name="certificate12A"
                    value={formData.certificate12A}
                    onChange={handleInputChange}
                  />

                  <FileUploadField
                    label="Identity Proof of NGO Head (Aadhaar/PAN)"
                    name="identityProof"
                    value={formData.identityProof}
                    onChange={handleInputChange}
                  />

                  <FileUploadField
                    label="Bank Account Details (Cancelled Cheque / Passbook)"
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Declaration */}
            {currentStep === 4 && (
              <div className="card-elevated p-6 sm:p-8 animate-fade-in">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Declaration & Submit
                </h2>

                <div className="bg-accent rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Application Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">NGO Name:</span> {formData.ngoName || 'Not provided'}</p>
                    <p><span className="text-muted-foreground">Category:</span> {categories.find(c => c.id === formData.category)?.name || 'Not selected'}</p>
                    <p><span className="text-muted-foreground">Location:</span> {formData.city}, {formData.state}</p>
                    <p><span className="text-muted-foreground">Contact:</span> {formData.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/30 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-warning mb-2">Important Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    After submission, your application will be reviewed by our admin team. 
                    This process typically takes 3-5 business days. You will receive an email 
                    notification once your application is approved or if additional information is needed.
                  </p>
                </div>

                <div className="border border-border rounded-xl p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="declarationAccepted"
                      checked={formData.declarationAccepted}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      I hereby declare that all the information provided in this application 
                      is true, accurate, and complete to the best of my knowledge. I understand 
                      that providing false information may result in rejection or removal of our 
                      NGO from the SevaConnect platform. I am authorized to submit this 
                      application on behalf of the organization.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-accent transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-hero flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Application</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const FileUploadField = ({ label, name, value, onChange, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
          id={name}
          accept=".pdf,.jpg,.jpeg,.png"
          required={required}
        />
        <label
          htmlFor={name}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors"
        >
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {value ? value.name : 'Click to upload (PDF, JPG, PNG)'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default NGORegistration;
