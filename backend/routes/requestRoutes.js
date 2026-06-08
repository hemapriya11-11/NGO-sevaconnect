const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `req-${Date.now()}-${file.originalname}`)
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

const { protect, authorize, admin } = require('../middleware/authMiddleware');

router.post('/', protect, upload.array('supportingFiles', 5), requestController.createRequest);
router.get('/user', protect, requestController.getUserRequests);
router.get('/ngo', protect, authorize('ngo'), requestController.getNGORequests);
router.patch('/:id', protect, authorize('ngo'), requestController.updateRequestStatus);
router.patch('/:id/flag', protect, authorize('ngo'), requestController.flagSuspicious);
router.patch('/:id/internal-notes', protect, authorize('ngo'), requestController.updateInternalNotes);
router.patch('/admin/block-user/:userId', protect, admin, requestController.blockUserByAdmin);
router.get('/admin/flagged', protect, admin, requestController.getFlaggedRequests);
router.get('/admin/all', protect, admin, requestController.getAllRequestsByAdmin);

module.exports = router;
