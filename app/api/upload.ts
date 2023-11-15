import express from 'express';
import multer from 'multer';

// Create Express app
const app = express();

// Configure CORS for React app origin
// app.use(cors({
//     origin: 'http://your-react-app-origin.com' // Replace with the origin of your React app
// }));

// Configure multer middleware for file upload
const upload = multer({
    dest: 'uploads/', // Specify the directory to store uploaded files
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        // Check file types to allow JPEG, PNG, and TXT files
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and TXT files are allowed.'));
        }
    },
});

// Define the file upload route
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded.');
        }

        // File upload was successful
        res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
        // Handle potential errors
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});