const HelpRequest = require('../models/HelpRequest');
const NGO = require('../models/NGO');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
  try {
    const { ngoId, requestDetails, phone, email } = req.body;
    
    // Check if user is blocked
    if (req.user.isBlocked) {
       return res.status(403).json({ error: 'Your account is blocked from submitting requests.' });
    }

    // Rate limiting: max 3 per week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const count = await HelpRequest.countDocuments({ 
       userId: req.user._id, 
       createdAt: { $gte: lastWeek } 
    });

    if (count >= 3) {
       return res.status(429).json({ error: 'You have reached the maximum limit of 3 requests per week. Please wait before submitting more.' });
    }

    // Check if the NGO exists and is approved
    const ngo = await NGO.findById(ngoId);
    if (!ngo || ngo.status !== 'approved') {
      return res.status(403).json({ error: 'Requests are only allowed for approved NGOs' });
    }

    // Handle files
    let supportingFiles = [];
    if (req.files) {
      supportingFiles = req.files.map(f => `/uploads/${f.filename}`);
    }

    const helpRequest = new HelpRequest({
      userId: req.user._id,
      ngoId,
      requestDetails: typeof requestDetails === 'string' ? JSON.parse(requestDetails) : requestDetails,
      phone,
      email,
      supportingFiles,
      status: 'submitted',
      eligibilityStatus: 'pending'
    });

    await helpRequest.save();

    // Increment user total requests
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalRequests: 1 } });

    res.status(201).json({ message: 'Request submitted successfully', helpRequest });
  } catch (error) {
    console.error('Error submitting help request:', error);
    res.status(500).json({ error: 'Server error submitting request' });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ userId: req.user._id })
      .populate('ngoId', 'ngoName image')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNGORequests = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ ownerId: req.user._id });
    if (!ngo) return res.status(404).json({ error: 'NGO profile not found' });

    const requests = await HelpRequest.find({ ngoId: ngo._id })
      .populate('userId', 'name email phone totalRequests approvedRequests rejectedRequests isPhoneVerified')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching NGO requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, eligibilityStatus, notes } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) return res.status(404).json({ error: 'Help request not found' });

    const ngo = await NGO.findById(helpRequest.ngoId);
    if (ngo.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const oldStatus = helpRequest.status;
    if (status) helpRequest.status = status;
    if (eligibilityStatus) helpRequest.eligibilityStatus = eligibilityStatus;
    if (notes !== undefined) helpRequest.notes = notes;

    await helpRequest.save();

    // Update NGO Impact
    if (status === 'completed' && oldStatus !== 'completed') {
       await NGO.findByIdAndUpdate(ngo._id, { $inc: { totalPeopleHelped: 1 } });
    }

    // Update User Trust Metrics
    if (status === 'approved' && oldStatus !== 'approved') {
       await User.findByIdAndUpdate(helpRequest.userId, { $inc: { approvedRequests: 1 } });
    } else if (status === 'rejected' && oldStatus !== 'rejected') {
       await User.findByIdAndUpdate(helpRequest.userId, { $inc: { rejectedRequests: 1 } });
    }

    res.status(200).json({ message: 'Request updated', helpRequest });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating request' });
  }
};

exports.flagSuspicious = async (req, res) => {
  try {
    const { isSuspicious } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) return res.status(404).json({ error: 'Request not found' });
    
    helpRequest.isSuspicious = isSuspicious;
    await helpRequest.save();
    res.status(200).json({ message: 'Request status updated', helpRequest });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateInternalNotes = async (req, res) => {
  try {
    const { internalNotes } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) return res.status(404).json({ error: 'Request not found' });

    helpRequest.internalNotes = internalNotes;
    await helpRequest.save();
    res.status(200).json({ message: 'Internal notes updated', helpRequest });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.blockUserByAdmin = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.isBlocked = isBlocked;
    await user.save();
    res.status(200).json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFlaggedRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ isSuspicious: true })
      .populate('userId', 'name email isBlocked')
      .populate('ngoId', 'ngoName email phone city state address location')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllRequestsByAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const requests = await HelpRequest.find(query)
      .populate('userId', 'name email phone isBlocked')
      .populate('ngoId', 'ngoName email phone city state address location category mission')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
