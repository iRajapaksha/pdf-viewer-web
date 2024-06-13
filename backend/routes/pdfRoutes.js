const express = require('express');
const { getPDFs, uploadPDF, upload , deletePDF, getOnePdf} = require('../controllers/pdfControllers');
const {protect} = require('../middlewares/auth')
const router = express.Router();

router.post('/upload', protect,upload.single('pdf'), uploadPDF);
router.get('/get', protect,getPDFs);
router.delete('/:id',protect,deletePDF )
router.get('/get/:id',protect, getOnePdf)

module.exports = router;


