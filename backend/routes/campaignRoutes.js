const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('ngo'), campaignController.createCampaign);
router.get('/:ngoId', campaignController.getNGOCampaigns);
router.patch('/:id', protect, authorize('ngo'), campaignController.updateCampaignStatus);

module.exports = router;
