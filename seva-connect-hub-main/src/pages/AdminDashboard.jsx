import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Building2, Users, Clock, CheckCircle, XCircle, 
  Eye, FileText, ChevronDown, ChevronUp, AlertCircle, Shield,
  Phone, Mail, MapPin, Globe, ExternalLink, Filter
} from 'lucide-react';
import { categories } from '../data/mockData';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [flaggedRequests, setFlaggedRequests] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [requestFilter, setRequestFilter] = useState('all'); // all, verification_pending, rejected, approved, submitted
  const [appFilter, setAppFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchApplications();
    fetchSupportRequests();
    fetchFlaggedRequests();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ngos/admin/ngos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    }
  };

  const fetchSupportRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/requests/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSupportRequests(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFlaggedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/requests/admin/flagged', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFlaggedRequests(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requests/admin/block-user/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isBlocked })
      });
      if (response.ok) {
        toast.info(isBlocked ? 'User blocked' : 'User unblocked');
        fetchFlaggedRequests();
        fetchSupportRequests();
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ngos/admin/ngo/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      if (!response.ok) throw new Error('Failed to approve');
      
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'approved' } : app));
      toast.success('NGO approved successfully!');
    } catch (error) {
      toast.error('Error approving NGO');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const reason = prompt("Reason for rejection:");
      if (reason === null) return;

      const response = await fetch(`/api/ngos/admin/ngo/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      if (!response.ok) throw new Error('Failed to reject');
      
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
      toast.error('NGO application rejected');
    } catch (error) {
      toast.error('Error rejecting NGO');
    }
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  const filteredApps = applications.filter(app => {
    if (appFilter === 'all') return true;
    return app.status === appFilter;
  });

  const filteredSupport = supportRequests.filter(req => {
    if (requestFilter === 'all') return true;
    return req.status === requestFilter;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-secondary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
              Admin Control Center
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-lg">
            Manage NGO registrations, review support requests, and monitor platform health
          </p>
        </div>
      </section>

      <section className="section-padding bg-background min-h-[80vh]">
        <div className="container-custom">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <div className="card-elevated p-4 border-l-4 border-warning">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10 text-warning"><Clock className="w-5 h-5"/></div>
                <div>
                   <div className="text-xl font-bold">{pendingCount}</div>
                   <div className="text-xs text-muted-foreground uppercase font-semibold">Pending NGO</div>
                </div>
              </div>
            </div>
            <div className="card-elevated p-4 border-l-4 border-success">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 text-success"><CheckCircle className="w-5 h-5"/></div>
                <div>
                   <div className="text-xl font-bold">{approvedCount}</div>
                   <div className="text-xs text-muted-foreground uppercase font-semibold">Approved NGO</div>
                </div>
              </div>
            </div>
            <div className="card-elevated p-4 border-l-4 border-destructive">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive"><XCircle className="w-5 h-5"/></div>
                <div>
                   <div className="text-xl font-bold">{rejectedCount}</div>
                   <div className="text-xs text-muted-foreground uppercase font-semibold">Rejected NGO</div>
                </div>
              </div>
            </div>
            <div className="card-elevated p-4 border-l-4 border-primary">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Eye className="w-5 h-5"/></div>
                <div>
                   <div className="text-xl font-bold">{supportRequests.filter(r => r.status === 'verification_pending').length}</div>
                   <div className="text-xs text-muted-foreground uppercase font-semibold">Pending Requests</div>
                </div>
              </div>
            </div>
            <div className="card-elevated p-4 border-l-4 border-secondary">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary"><AlertCircle className="w-5 h-5"/></div>
                <div>
                   <div className="text-xl font-bold">{flaggedRequests.length}</div>
                   <div className="text-xs text-muted-foreground uppercase font-semibold">Flagged Spam</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b border-border mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-4 font-semibold text-sm transition-all relative ${
                activeTab === 'applications' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              NGO APPLICATIONS
              {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-4 font-semibold text-sm transition-all relative ${
                activeTab === 'requests' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              SUPPORT REQUESTS
              {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('spam')}
              className={`px-6 py-4 font-semibold text-sm transition-all relative ${
                activeTab === 'spam' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              SPAM MONITORING
              {activeTab === 'spam' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          </div>

          {/* Tab Content: NGO Applications */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-display text-2xl font-bold text-foreground">NGO Registration Pipeline</h2>
                <div className="flex items-center gap-2 bg-accent/50 p-1 rounded-lg">
                  {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setAppFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                        appFilter === f ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredApps.length === 0 ? (
                <div className="card-elevated p-12 text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold opacity-60">No matching applications found</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApps.map((app) => {
                    const category = categories.find(c => c.id === app.category);
                    const isExpanded = expandedId === app._id;

                    return (
                      <div key={app._id} className={`card-elevated overflow-hidden border-t-2 ${
                        app.status === 'pending' ? 'border-warning' : app.status === 'approved' ? 'border-success' : 'border-destructive'
                      }`}>
                        <div 
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-accent/20"
                          onClick={() => setExpandedId(isExpanded ? null : app._id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center text-xl shadow-inner">
                              {category?.icon || '🏢'}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground flex items-center gap-2">
                                {app.ngoName}
                                {app.status === 'approved' && <CheckCircle className="w-4 h-4 text-success" />}
                              </h3>
                              <p className="text-muted-foreground text-xs flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {app.location} • {category?.name || app.category}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold tracking-wider">
                                REGISTERED: {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className={`status-badge text-[10px] sm:text-xs font-bold uppercase ${
                              app.status === 'pending' ? 'status-pending' : app.status === 'approved' ? 'status-approved' : 'status-rejected'
                            }`}>
                              {app.status}
                            </span>
                            {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-6 pt-0 border-t border-border/50 animate-fade-in bg-accent/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
                              {/* Deep Info */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">About Organization</h4>
                                  <p className="text-sm font-medium">{app.mission}</p>
                                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{app.description}</p>
                                </div>
                                <div className="p-3 bg-background rounded-lg border border-border shadow-sm">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Established</span>
                                    <span className="text-sm font-bold">{app.yearEstablished}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Operation Areas</span>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{app.areasOfOperation?.length || 0} Cities</span>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Info */}
                              <div className="space-y-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Contact Details</h4>
                                <ul className="space-y-3">
                                  <li className="flex items-center gap-3 text-sm">
                                    <div className="p-1.5 rounded-md bg-primary/10 text-primary"><Phone size={14} /></div>
                                    <span className="font-medium">{app.phone}</span>
                                  </li>
                                  <li className="flex items-center gap-3 text-sm">
                                    <div className="p-1.5 rounded-md bg-primary/10 text-primary"><Mail size={14} /></div>
                                    <span className="font-medium">{app.email}</span>
                                  </li>
                                  {app.website && (
                                    <li className="flex items-center gap-3 text-sm">
                                      <div className="p-1.5 rounded-md bg-primary/10 text-primary"><Globe size={14} /></div>
                                      <a href={app.website} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">{app.website.replace(/^https?:\/\//, '')}</a>
                                    </li>
                                  )}
                                  <li className="flex items-start gap-3 text-sm">
                                    <div className="p-1.5 rounded-md bg-primary/10 text-primary mt-0.5"><MapPin size={14} /></div>
                                    <span className="text-muted-foreground">{app.address}, {app.city}, {app.state}</span>
                                  </li>
                                </ul>
                              </div>

                              {/* Registration Documents */}
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Verification Files</h4>
                                <div className="space-y-2">
                                  {app.uploadedFiles?.map((file, idx) => {
                                    const fileName = file.split('-').pop();
                                    return (
                                      <a 
                                        key={idx} 
                                        href={`${file}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors group"
                                      >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <FileText className="w-4 h-4 text-primary shrink-0" />
                                          <span className="text-xs font-medium truncate">{fileName}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                                      </a>
                                    );
                                  })}
                                  {(!app.uploadedFiles || app.uploadedFiles.length === 0) && (
                                    <p className="text-xs text-muted-foreground italic p-4 text-center bg-background rounded-xl border-dashed border-2 border-border">No documents uploaded.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {app.status === 'rejected' && app.rejectionReason && (
                              <div className="mb-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                                <h5 className="text-xs font-bold text-destructive uppercase mb-1">Rejection Reason</h5>
                                <p className="text-sm">{app.rejectionReason}</p>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                              {app.status === 'pending' && (
                                <>
                                  <button onClick={() => handleApprove(app._id)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-success text-success-foreground font-bold hover:brightness-110 active:scale-95 transition-all">
                                    <CheckCircle className="w-5 h-5" /> APPROVE NGO
                                  </button>
                                  <button onClick={() => handleReject(app._id)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-bold hover:brightness-110 active:scale-95 transition-all">
                                    <XCircle className="w-5 h-5" /> REJECT NGO
                                  </button>
                                </>
                              )}
                              {app.status === 'rejected' && (
                                <button onClick={() => handleApprove(app._id)} className="px-6 py-3 rounded-xl bg-success/20 text-success border border-success/30 font-bold hover:bg-success hover:text-success-foreground transition-all">
                                  RECONSIDER & APPROVE
                                </button>
                              )}
                              {app.status === 'approved' && (
                                <button onClick={() => handleReject(app._id)} className="px-6 py-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 font-bold hover:bg-destructive hover:text-destructive-foreground transition-all">
                                  REVOKE APPROVAL
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Support Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-display text-2xl font-bold text-foreground">Global Support Monitor</h2>
                <div className="flex items-center gap-2 bg-accent/50 p-1 rounded-lg">
                  {['all', 'verification_pending', 'rejected', 'completed'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setRequestFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                        requestFilter === f ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {filteredSupport.length === 0 ? (
                <div className="card-elevated p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold opacity-60">No support requests in this category</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSupport.map((req) => (
                    <div key={req._id} className="card-elevated overflow-hidden border-l-4 border-l-primary">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                          {/* User Side */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                {req.userId?.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold">{req.userId?.name}</h4>
                                <p className="text-xs text-muted-foreground">{req.userId?.email}</p>
                              </div>
                            </div>
                            <div className="bg-accent/20 p-4 rounded-xl border border-border">
                              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Request Subject</h5>
                              <p className="text-sm italic">"{Object.values(req.requestDetails || {})[0]?.substring(0, 100)}..."</p>
                            </div>
                          </div>

                          {/* NGO Info - FULL INFO */}
                          <div className="flex-1 border-y lg:border-y-0 lg:border-x border-border/50 px-0 lg:px-6 py-4 lg:py-0">
                             <div className="flex items-center gap-2 mb-3">
                               <Building2 className="w-4 h-4 text-primary" />
                               <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned NGO</span>
                             </div>
                             <div className="space-y-3">
                               <div className="font-bold text-foreground">{req.ngoId?.ngoName}</div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                   <MapPin className="w-3.5 h-3.5" /> {req.ngoId?.city}, {req.ngoId?.state}
                                 </div>
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                   <Phone className="w-3.5 h-3.5" /> {req.ngoId?.phone}
                                 </div>
                                 <div className="flex items-center gap-2 text-muted-foreground col-span-full">
                                   <Mail className="w-3.5 h-3.5" /> {req.ngoId?.email}
                                 </div>
                               </div>
                               {req.ngoId?.address && (
                                 <p className="text-[10px] text-muted-foreground italic">{req.ngoId.address}</p>
                               )}
                             </div>
                          </div>

                          {/* Action/Status */}
                          <div className="w-full lg:w-48 flex flex-col justify-center items-center lg:items-end gap-3">
                            <span className={`status-badge text-[10px] font-bold uppercase ${
                              req.status === 'verification_pending' ? 'status-pending' : 
                              req.status === 'rejected' ? 'status-rejected' : 
                              req.status === 'completed' ? 'status-approved' : 'status-submitted'
                            }`}>
                              {req.status.replace('_', ' ')}
                            </span>
                            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                              UPDATED: {new Date(req.updatedAt).toLocaleDateString()}
                            </div>
                            <button className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/70 transition-colors uppercase">
                              <Eye size={14} /> Full Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Spam Monitoring */}
          {activeTab === 'spam' && (
            <div className="card-elevated p-6 overflow-hidden">
               <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Flagged Suspicious Activity
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-accent/30">
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Requester</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Flagged By NGO</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Incident Notes</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Protection Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {flaggedRequests.map(req => (
                      <tr key={req._id} className="hover:bg-accent/5">
                        <td className="px-6 py-6">
                          <div className="font-bold text-foreground">{req.userId?.name}</div>
                          <div className="text-xs text-muted-foreground">{req.userId?.email}</div>
                          {req.userId?.isBlocked && <span className="mt-1 inline-block text-[8px] font-black tracking-tighter text-destructive uppercase bg-destructive/10 px-1.5 py-0.5 rounded border border-destructive/20">Blocked</span>}
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm font-bold text-primary">{req.ngoId?.ngoName}</div>
                          <div className="text-[10px] text-muted-foreground">{req.ngoId?.city}, {req.ngoId?.state}</div>
                        </td>
                        <td className="px-6 py-6 max-w-xs">
                          <p className="text-xs italic text-muted-foreground border-l-2 border-primary/20 pl-3">"{req.internalNotes || 'No specific notes provided'}"</p>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button 
                            onClick={() => handleBlockUser(req.userId?._id, !req.userId?.isBlocked)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-sm ${
                              req.userId?.isBlocked 
                              ? 'bg-success text-success-foreground hover:shadow-success/25' 
                              : 'bg-destructive text-destructive-foreground hover:shadow-destructive/25'
                            }`}
                          >
                            {req.userId?.isBlocked ? 'Restore Access' : 'Restrict User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {flaggedRequests.length === 0 && (
                      <tr><td colSpan="4" className="text-center py-16">
                        <Shield className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No safety alerts at this time.</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
