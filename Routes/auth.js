const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: "Accès refusé. Jeton manquant." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return res.status(401).json({ message: "Jeton invalide." });
        } else {
            req.user = userData;
            next();
        }
    });
}

module.exports = verifyToken;
