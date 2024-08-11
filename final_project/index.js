// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const general = require('./router/general.js');
const customerRouter = require('./router/auth_users.js');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'my_super_secret_key_for_jwt_123!@#'; 

app.use(express.json());

// session
app.use(session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "Token inválido" });
            }
        });
    } else {
        return res.status(401).json({ message: "Usuario no autenticado" });
    }
});

app.use('/customer', customerRouter);
app.use("/", general.general);

app.listen(PORT, () => console.log(`Server is running: ${PORT}`));