const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const { protect } = require('./middlewares/auth'); 


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);


mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});
app.get('/',protect, (req,res)=>{
    res.send('Hello world!!!')
})
