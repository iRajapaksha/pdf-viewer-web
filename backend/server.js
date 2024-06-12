const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const { protect } = require('./middlewares/auth');

const path = require('path');
const app = express();

app.use(express.json());

app.use(cors()); // Enable CORS for all routes

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/pdfs', pdfRoutes);

// Assuming PDFs are stored in the 'uploads' directory

mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', protect, (req, res) => {
    res.send('Hello world!!!')
});

