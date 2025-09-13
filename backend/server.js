require("dotenv").config();
const express = require('express');
const app = express();
const PORT = 5000;
const cors = require("cors");
const OTP = require('./seller_routes/otp.js');
const AUTH = require('./seller_routes/auth');
const session = require('express-session');
const sellerRoutes = require('./seller_routes/sellerRoutes');
const product = require('./seller_routes/productRoutes');
const userRoutes = require('./user_routes/userRoutes.js');
const deliveryRoutes = require('./dilivery_routes/deliveryRoutes');

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:3000', 
];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use('/otp',OTP);
app.use('/auth',AUTH);
app.use('/seller', sellerRoutes);
app.use('/user', userRoutes);
app.use('/products', product); 
app.use('/delivery', deliveryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});