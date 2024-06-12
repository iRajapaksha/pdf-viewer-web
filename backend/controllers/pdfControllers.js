const PDF = require('../models/pdf');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const getOnePdf = async (req, res) => {
    try {
        const pdfId = req.params.id;
        const pdf = await PDF.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${pdf.filename}`;
        res.status(200).json({ ...pdf._doc, url: pdfUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePDF = async (req, res) => {
    try {
        const pdfId = req.params.id;

        // Find the PDF by ID
        const pdf = await PDF.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, '../uploads', pdf.filename);
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to delete file' });
            }

            // Delete the PDF document from MongoDB
            await PDF.findByIdAndDelete(pdfId);
            res.status(200).json({ message: 'PDF deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, uploadPDF, getPDFs, deletePDF, getOnePdf };


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