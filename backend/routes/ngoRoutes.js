const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ngoController = require('../controllers/ngoController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function(req, file, cb) {
    // Generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // accept images and pdfs
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only PDFs and images are allowed'));
    }
  }
});

const ngoUploads = upload.any();

const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', protect, ngoUploads, ngoController.registerNGO);
router.get('/', ngoController.getAllNGOs);
router.get('/my', protect, ngoController.getMyNGO);
router.get('/:id', ngoController.getNGOById);

// Admin Routes (Can be split, but kept here for logical grouping)
router.get('/admin/ngos', protect, admin, ngoController.getAdminNGOs);
router.patch('/admin/ngo/:id', protect, admin, ngoController.updateNGOStatus);

module.exports = router;
