const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

module.exports = mongoose.model('Pdf', pdfSchema);
