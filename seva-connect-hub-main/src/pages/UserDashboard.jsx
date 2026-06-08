import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, MapPin, Building2, UserCircle, Star, Shield, CheckCircle, Clock } from 'lucide-react';
import { categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, refreshUserData } = useAuth();
  const [ngos, setNgos] = useState([]);
  const [savedNgos, setSavedNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    refreshUserData();
    const token = localStorage.getItem('token');
    // Fetch NGOs
    fetch('/api/ngos')
      .then((res) => res.json())
      .then((data) => {
        setNgos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ngos', err);
        setLoading(false);
      });

    // Fetch User Requests
    if (token) {
      fetch('/api/requests/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(err => console.error('Error fetching requests', err));
    }

    // Load saved NGOs from local storage (mock implementation of saved NGOs)
    const saved = JSON.parse(localStorage.getItem('savedNgos')) || [];
    setSavedNgos(saved);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-600';
      case 'verification_pending': return 'bg-purple-100 text-purple-600';
      case 'under_review': return 'bg-orange-100 text-orange-600';
      case 'approved': return 'bg-teal-100 text-teal-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      case 'completed': return 'bg-green-100 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusProgress = (status) => {
    const stages = ['submitted', 'verification_pending', 'under_review', 'approved', 'completed'];
    const index = stages.indexOf(status);
    if (status === 'rejected') return 0;
    if (index === -1) return 20; 
    return ((index + 1) / stages.length) * 100;
  };

  const toggleSaveNgo = (id) => {
    let updatedSaved;
    if (savedNgos.includes(id)) {
      updatedSaved = savedNgos.filter(savedId => savedId !== id);
    } else {
      updatedSaved = [...savedNgos, id];
    }
    setSavedNgos(updatedSaved);
    localStorage.setItem('savedNgos', JSON.stringify(updatedSaved));
  };

  const filteredNgos = ngos.filter(ngo => 
    (ngo.ngoName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     ngo.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <section className="bg-primary py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center relative">
                <UserCircle className="w-10 h-10 text-secondary" />
                {user?.isPhoneVerified && <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1 border-2 border-primary"><Shield className="w-3 h-3 text-white fill-current" /></div>}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">
                   Welcome back, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-primary-foreground/70">
                   Manage your support activities and help requests.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm min-w-[80px]">
                <div className="text-xl font-bold">{user?.totalRequests || 0}</div>
                <div className="text-[10px] uppercase font-bold text-white/60">Total REQ</div>
              </div>
              <div className="text-center bg-success/20 rounded-2xl px-4 py-3 backdrop-blur-sm min-w-[80px]">
                <div className="text-xl font-bold text-success-foreground">{user?.approvedRequests || 0}</div>
                <div className="text-[10px] uppercase font-bold text-success-foreground/60">Approved</div>
              </div>
              <div className="text-center bg-destructive/20 rounded-2xl px-4 py-3 backdrop-blur-sm min-w-[80px]">
                <div className="text-xl font-bold text-destructive-foreground">{user?.rejectedRequests || 0}</div>
                <div className="text-[10px] uppercase font-bold text-destructive-foreground/60">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background/50">
        <div className="container-custom">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="card-elevated p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{ngos.length}</div>
                <div className="text-sm text-muted-foreground">NGOs in Tamil Nadu</div>
              </div>
            </div>
            <div className="card-elevated p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{savedNgos.length}</div>
                <div className="text-sm text-muted-foreground">Saved NGOs</div>
              </div>
            </div>
            <div className="card-elevated p-6 flex items-center gap-4 border-l-4 border-accent">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{requests.length}</div>
                <div className="text-sm text-muted-foreground">Help History</div>
              </div>
            </div>
          </div>

          {/* User Requests Section */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Track My Help Requests</h2>
            <div className="card-elevated p-6 sm:p-8">
              <div className="space-y-6">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <div key={request._id} className={`p-5 rounded-3xl bg-accent/20 border border-border shadow-sm transition-all hover:shadow-md ${request.status === 'rejected' ? 'grayscale-[0.5] opacity-80' : ''}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                             {request.ngoId?.image ? <img src={request.ngoId.image} className="w-full h-full object-cover"/> : <Building2 className="w-6 h-6 text-primary" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{request.ngoId?.ngoName || 'Unknown NGO'}</h4>
                            <p className="text-xs text-muted-foreground">Request ID: {request._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="relative mb-6">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter mb-2">
                           <span className={request.status === 'submitted' ? 'text-primary' : ''}>Sent</span>
                           <span className={request.status === 'verification_pending' ? 'text-purple-600' : ''}>Verified</span>
                           <span className={request.status === 'under_review' ? 'text-orange-600' : ''}>Review</span>
                           <span className={request.status === 'approved' ? 'text-teal-600' : ''}>Approved</span>
                           <span className={request.status === 'completed' ? 'text-green-600' : ''}>Delivered</span>
                        </div>
                        <div className="overflow-hidden h-1.5 flex rounded-full bg-accent/30">
                          <div
                            style={{ width: `${getStatusProgress(request.status)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ease-out ${request.status === 'rejected' ? 'bg-red-500' : 'bg-primary'}`}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-white/50 rounded-2xl border border-border/50 text-sm">
                           <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Your Details</span>
                           <p className="text-foreground line-clamp-2">{request.requestDetails?.message}</p>
                        </div>
                        {request.notes && (
                           <div className="p-3 bg-primary/5 rounded-2xl border border-primary/20 text-sm">
                             <span className="block text-[10px] font-bold text-primary uppercase mb-1">Official Note</span>
                             <p className="text-foreground italic">"{request.notes}"</p>
                           </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't submitted any help requests yet. Need assistance? Visit an NGO profile to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mb-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search NGOs by name or description..."
              className="input-field pl-12 py-4 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Discover NGOs in Tamil Nadu</h2>

          {loading ? (
             <div className="text-center py-12 text-muted-foreground">Loading NGOs...</div>
          ) : filteredNgos.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground card-elevated">No NGOs found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNgos.map(ngo => {
                const category = categories.find(c => c.id === ngo.category);
                const isSaved = savedNgos.includes(ngo._id);

                return (
                  <div key={ngo._id} className="card-elevated p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl">
                          {category?.icon}
                        </div>
                        <button 
                          onClick={() => toggleSaveNgo(ngo._id)}
                          className="p-2 rounded-full hover:bg-accent transition"
                        >
                          <Star className={`w-5 h-5 ${isSaved ? 'text-secondary fill-secondary' : 'text-muted-foreground'}`} />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{ngo.ngoName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {ngo.city}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {ngo.description}
                      </p>
                    </div>
                    <Link
                      to={`/ngo/${ngo._id}`}
                      className="w-full btn-hero py-2.5 flex items-center justify-center rounded-lg font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
