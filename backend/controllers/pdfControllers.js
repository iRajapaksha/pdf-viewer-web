const PDF = require('../models/pdf');
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const pdfMetadata = {
            filename: req.file.filename,
            path: req.file.path,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadDate: new Date(),
            user: req.user.id // Assuming user information is added by authentication middleware
        };

        // Save pdfMetadata to MongoDB
        const pdf = new PDF(pdfMetadata);
        const savedPdf = await pdf.save();
        res.status(201).json({ message: 'PDF uploaded successfully', pdfMetadata, id: savedPdf.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getPDFs = async (req, res) => {
    try {
        const pdfs = await PDF.find({ user: req.user.id });
        res.json(pdfs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { upload, uploadPDF, getPDFs };


// const PDF = require('../models/pdf');
// const multer =require('multer')
// const path = require('path');


// // Configure multer for file storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../uploads'));
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

    
// const uploadPDF =  async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         const pdfMetadata = {
//             filename: req.file.filename,
//             path: req.file.path,
//             originalname: req.file.originalname,
//             mimetype: req.file.mimetype,
//             size: req.file.size,
//             uploadDate: new Date()
//         };

//         // Save pdfMetadata to MongoDB
//         const pdf = new Pdf(pdfMetadata);
//         const savedPdf = await pdf.save();
//         res.status(201).json({ message: 'PDF uploaded successfully', pdfMetadata, id: savedPdf.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// const getPDFs = async (req, res) => {
//     try {
//         const pdfs = await PDF.find({ user: req.user.id });
//         res.json(pdfs);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// module.exports = { upload, uploadPDF, getPDFs };