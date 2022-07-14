const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const csrfProtection = csrf({ cookie: true });

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));  

readdirSync('./routes').map(r => 
    app.use('/api', require(`./routes/${r}`))    
);

app.use(csrfProtection);
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

const port = process.env.PORT || 8000; 

mongoose
.connect(process.env.DATABASE, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => {
    console.log("DB connected");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => console.log("DB Error => ", err));