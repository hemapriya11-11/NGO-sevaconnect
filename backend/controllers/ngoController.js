const NGO = require('../models/NGO');

exports.registerNGO = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Process areasOfOperation
    let parsedAreas = [];
    if (data.areasOfOperation) {
      if (Array.isArray(data.areasOfOperation)) {
        parsedAreas = data.areasOfOperation;
      } else if (typeof data.areasOfOperation === 'string') {
        parsedAreas = data.areasOfOperation.split(',').map(a => a.trim());
      }
      data.areasOfOperation = parsedAreas;
    }

    // Process uploaded files into an array
    let uploadedFiles = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
         uploadedFiles = req.files.map(f => `/uploads/${f.filename}`);
      } else {
         Object.values(req.files).forEach(fileArray => {
           fileArray.forEach(f => {
             uploadedFiles.push(`/uploads/${f.filename}`);
           });
         });
      }
    }

    // Upsert the NGO or create new (link to user)
    const newNgo = new NGO({
      ...data,
      uploadedFiles,
      ownerId: req.user._id,
      registrationCompleted: true,
      status: 'pending' // Force initial status
    });

    await newNgo.save();

    return res.status(201).json({ message: 'NGO registered successfully', ngo: newNgo });

  } catch (error) {
    console.error('Error registering NGO:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'An NGO with this email already exists' });
    }
    return res.status(500).json({ error: 'Server error during NGO registration' });
  }
};

exports.getAllNGOs = async (req, res) => {
  try {
    const { category, state } = req.query;
    
    // Only return approved NGOs for public APIs
    let query = { status: 'approved' };
    
    if (category) query.category = category;
    if (state) query.state = state;

    const ngos = await NGO.find(query).sort({ createdAt: -1 });
    return res.status(200).json(ngos);
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    return res.status(500).json({ error: 'Server error fetched NGOs' });
  }
};

exports.getAdminNGOs = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status; // Allows filtering by pending

    const ngos = await NGO.find(query).sort({ createdAt: -1 });
    return res.status(200).json(ngos);
  } catch (error) {
    console.error('Error fetching admin NGOs:', error);
    return res.status(500).json({ error: 'Server error fetched admin NGOs' });
  }
};

exports.getMyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ ownerId: req.user._id });
    if (!ngo) {
      return res.status(200).json({ registrationCompleted: false });
    }
    return res.status(200).json(ngo);
  } catch (error) {
    console.error('Error fetching My NGO:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }
    return res.status(200).json(ngo);
  } catch (error) {
    console.error('Error fetching NGO details:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateNGOStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body; // pending, approved, rejected
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const update = { status };
    if (rejectionReason !== undefined) update.rejectionReason = rejectionReason;

    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    return res.status(200).json({ message: `NGO status updated to ${status}`, ngo });
  } catch (error) {
    console.error('Error updating NGO status:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
