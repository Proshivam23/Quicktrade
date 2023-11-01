const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./frontend/public"); // Specify the destination folder for uploads
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname); // Rename the file with a unique name
    },
});

const fileFilter = (req, file, cb) => {
    // Allow only certain file types (e.g., images)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB file size limit
    },
    fileFilter,
});

module.exports = upload;
