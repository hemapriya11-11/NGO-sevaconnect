import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Building2, Edit2, Save, X, Plus, Trash2,
  MapPin, Phone, Mail, Clock, Globe, Users,
  Calendar, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';

const NGODashboard = () => {
  const { user, ngoData: contextNgoData, refreshNgoData } = useAuth();
  const [requests, setRequests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', date: '', location: '' });

  const handleFlagSuspicious = async (requestId, isSuspicious) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requests/${requestId}/flag`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isSuspicious })
      });
      if (response.ok) {
        toast.info(isSuspicious ? 'Request flagged as suspicious' : 'Flag removed');
        fetchNGOData();
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleUpdateInternalNotes = async (requestId, internalNotes) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requests/${requestId}/internal-notes`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ internalNotes })
      });
      if (response.ok) {
        toast.success('Internal notes saved');
        fetchNGOData();
      }
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const fetchNGOData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [reqRes, campRes] = await Promise.all([
        fetch('/api/requests/ngo', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/campaigns/${contextNgoData._id}`)
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(data);
      }
      if (campRes.ok) {
        const data = await campRes.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  useEffect(() => {
    if (contextNgoData) {
      fetchNGOData();
    }
  }, [contextNgoData]);

  const handleStatusUpdate = async (requestId, payload) => {
// ... existing handleStatusUpdate ...
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        toast.success('Request updated successfully');
        fetchNGOData();
        refreshNgoData(); // To update people helped stat
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateCampaign = async (e) => {
// ... existing handleCreateCampaign ...
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newCampaign)
      });
      if (response.ok) {
        toast.success('Campaign created successfully');
        setShowCampaignForm(false);
        setNewCampaign({ title: '', description: '', date: '', location: '' });
        fetchNGOData();
        refreshNgoData();
      }
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const updateCampaignStatus = async (id, status) => {
// ... existing updateCampaignStatus ...
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        toast.success('Campaign status updated');
        fetchNGOData();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const [totalCollected, setTotalCollected] = useState(0);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
       try {
         const token = localStorage.getItem('token');
         const res = await fetch('/api/donations/received', { headers: { 'Authorization': `Bearer ${token}` } });
         if (res.ok) {
            const data = await res.json();
            setDonations(data.donations || []);
            setTotalCollected(data.totalAmount || 0);
         }
       } catch (err) { console.error(err); }
    };
    fetchDonations();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-secondary" />
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
                  NGO Dashboard
                </h1>
              </div>
              <p className="text-primary-foreground/80">
                Manage your organization's impact and operations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success text-success-foreground text-sm font-medium">
                Status: Approved
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Quick Stats ... keep existing grid ... */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
            <div className="card-elevated p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{contextNgoData?.totalPeopleHelped || 0}</div>
                  <div className="text-muted-foreground text-sm">People Helped</div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{contextNgoData?.totalCampaigns || 0}</div>
                  <div className="text-muted-foreground text-sm">Campaigns</div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{requests.length}</div>
                  <div className="text-muted-foreground text-sm">Total Requests</div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 bg-teal-50 border-teal-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-200">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-700">₹{totalCollected.toLocaleString()}</div>
                  <div className="text-teal-600/70 text-sm font-medium">Total Donations</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-border mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === 'requests' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Help Requests
              {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
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
              onClick={() => setActiveTab('donations')}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === 'donations' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Recent Donations
              {activeTab === 'donations' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          <div className="mb-12">
            {activeTab === 'requests' && (
              <div className="card-elevated p-6 overflow-hidden">
                <h3 className="font-display text-xl font-bold mb-6">User Help Requests</h3>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase">Requester & Trust</th>
                        <th className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase">Validation</th>
                        <th className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase">Eligibility</th>
                        <th className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase">Moderate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {requests.length > 0 ? requests.map((req) => (
                        <tr key={req._id} className={req.isSuspicious ? 'bg-red-50/50' : ''}>
                          <td className="px-4 py-4 min-w-[200px]">
                            <div className="font-bold flex items-center gap-1">
                              {req.userId?.name}
                              {req.userId?.isPhoneVerified && <Shield className="w-3 h-3 text-success fill-success" />}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">{req.phone}</div>
                            <div className="flex gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">REQ: {req.userId?.totalRequests}</span>
                              <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-600 text-[10px] font-bold">APP: {req.userId?.approvedRequests}</span>
                              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-bold">REJ: {req.userId?.rejectedRequests}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 max-w-[200px]">
                            <p className="text-sm line-clamp-1 mb-2">{req.requestDetails?.message}</p>
                            {req.supportingFiles?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {req.supportingFiles.map((file, i) => (
                                  <a key={i} href={`${file}`} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> Proof {i+1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={req.eligibilityStatus}
                              onChange={(e) => handleStatusUpdate(req._id, { eligibilityStatus: e.target.value })}
                              className="text-xs border-none bg-accent/50 rounded px-2 py-1 focus:ring-1 focus:ring-primary"
                            >
                              <option value="pending">Pending</option>
                              <option value="eligible">Eligible</option>
                              <option value="not_eligible">Not Eligible</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={req.status}
                              onChange={(e) => handleStatusUpdate(req._id, { status: e.target.value })}
                              className={`text-xs font-bold uppercase tracking-wider rounded px-2 py-1 border-none focus:ring-1 focus:ring-primary ${
                                req.status === 'completed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                              }`}
                            >
                              <option value="submitted">Submitted</option>
                              <option value="verification_pending">Pending Verify</option>
                              <option value="under_review">Under Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                               <label className="flex items-center gap-1 cursor-pointer group">
                                 <input 
                                  type="checkbox" 
                                  checked={req.isSuspicious} 
                                  onChange={(e) => handleFlagSuspicious(req._id, e.target.checked)}
                                  className="w-3.5 h-3.5 text-red-600 border-red-300 rounded focus:ring-red-500"
                                 />
                                 <span className="text-[10px] font-bold text-red-600 uppercase group-hover:underline">Flag Spam</span>
                               </label>
                               <textarea 
                                placeholder="Internal notes..."
                                onBlur={(e) => handleUpdateInternalNotes(req._id, e.target.value)}
                                defaultValue={req.internalNotes}
                                className="w-full text-[10px] p-1.5 rounded bg-muted/50 border-none resize-none focus:ring-1 focus:ring-primary h-12"
                               />
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="text-center py-8 text-muted-foreground">No requests found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-bold">Manage Campaigns</h3>
                  <button 
                    onClick={() => setShowCampaignForm(!showCampaignForm)}
                    className="btn px-4 py-2 bg-primary text-primary-foreground rounded-xl flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Campaign</span>
                  </button>
                </div>

                {showCampaignForm && (
                  <form onSubmit={handleCreateCampaign} className="mb-8 p-6 bg-accent/50 rounded-2xl border border-border space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <input 
                        type="text" placeholder="Campaign Title" className="input-field" required
                        value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                       />
                       <input 
                        type="date" className="input-field" required
                        value={newCampaign.date} onChange={e => setNewCampaign({...newCampaign, date: e.target.value})}
                       />
                    </div>
                    <input 
                      type="text" placeholder="Location" className="input-field" required
                      value={newCampaign.location} onChange={e => setNewCampaign({...newCampaign, location: e.target.value})}
                    />
                    <textarea 
                      placeholder="Description" className="input-field min-h-[100px]" required
                      value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
                    />
                    <div className="flex gap-2">
                       <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium">Create</button>
                       <button type="button" onClick={() => setShowCampaignForm(false)} className="px-6 py-2 bg-muted text-muted-foreground rounded-xl font-medium">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {campaigns.map(camp => (
                    <div key={camp._id} className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-foreground">{camp.title}</h4>
                        <p className="text-xs text-muted-foreground">{camp.location} • {new Date(camp.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${camp.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                          {camp.status}
                        </span>
                        {camp.status === 'active' && (
                          <button 
                            onClick={() => updateCampaignStatus(camp._id, 'completed')}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {campaigns.length === 0 && <p className="text-center py-8 text-muted-foreground">No campaigns created yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="card-elevated p-6 overflow-hidden">
                <h3 className="font-display text-xl font-bold mb-6">Recent Donations</h3>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Donor</th>
                        <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {donations.length > 0 ? donations.map((donation) => (
                        <tr key={donation._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium">{donation.userId?.name || 'Anonymous'}</div>
                            <div className="text-xs text-muted-foreground">{donation.userId?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 font-bold">₹{donation.amount}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(donation.createdAt).toLocaleDateString()}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="3" className="px-6 py-12 text-center text-muted-foreground italic">No donations received yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="card-elevated p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Organization Profile
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border text-foreground font-medium hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success text-success-foreground font-medium hover:bg-success/90 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        NGO Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      ) : (
                        <p className="text-foreground font-medium">{ngoData.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Category
                        </label>
                        <p className="text-foreground flex items-center gap-2">
                          <span>{category?.icon}</span>
                          <span>{category?.name}</span>
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Year Established
                        </label>
                        <p className="text-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {ngoData.yearEstablished}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Mission
                      </label>
                      {isEditing ? (
                        <textarea
                          name="mission"
                          value={editData.mission}
                          onChange={handleInputChange}
                          className="input-field min-h-24"
                        />
                      ) : (
                        <p className="text-foreground">{ngoData.mission}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          name="description"
                          value={editData.description}
                          onChange={handleInputChange}
                          className="input-field min-h-32"
                        />
                      ) : (
                        <p className="text-foreground">{ngoData.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Services Offered</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {((isEditing ? editData : ngoData).services || []).map((service, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium"
                      >
                        {service}
                        {isEditing && (
                          <button
                            onClick={() => removeService(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        placeholder="Add new service"
                        className="input-field flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addService()}
                      />
                      <button
                        onClick={addService}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-accent rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4" />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={editData.address}
                          onChange={handleInputChange}
                          className="input-field text-sm"
                        />
                      ) : (
                        <p className="text-sm text-foreground">{ngoData.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editData.phone}
                          onChange={handleInputChange}
                          className="input-field text-sm"
                        />
                      ) : (
                        <p className="text-sm text-foreground">{ngoData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          className="input-field text-sm"
                        />
                      ) : (
                        <p className="text-sm text-foreground">{ngoData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        Working Hours
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="workingHours"
                          value={editData.workingHours}
                          onChange={handleInputChange}
                          className="input-field text-sm"
                        />
                      ) : (
                        <p className="text-sm text-foreground">{ngoData.workingHours}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                        <Globe className="w-4 h-4" />
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          name="website"
                          value={editData.website}
                          onChange={handleInputChange}
                          className="input-field text-sm"
                        />
                      ) : (
                        <a 
                          href={ngoData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {ngoData.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NGODashboard;
