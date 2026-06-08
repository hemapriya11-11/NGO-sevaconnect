const Campaign = require('../models/Campaign');
const NGO = require('../models/NGO');

exports.createCampaign = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ ownerId: req.user._id });
    if (!ngo) return res.status(404).json({ error: 'NGO profile not found' });

    const campaign = new Campaign({
      ...req.body,
      ngoId: ngo._id
    });

    await campaign.save();

    // Increment campaign count in NGO profile
    await NGO.findByIdAndUpdate(ngo._id, { $inc: { totalCampaigns: 1 } });

    res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Server error creating campaign' });
  }
};

exports.getNGOCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ ngoId: req.params.ngoId }).sort({ date: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Server error fetched campaigns' });
  }
};

exports.updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Check ownership
    const ngo = await NGO.findById(campaign.ngoId);
    if (ngo.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    campaign.status = status;
    await campaign.save();

    res.status(200).json({ message: 'Campaign updated successfully', campaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Server error updating campaign' });
  }
};
