import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "No token, Authorization denied." });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log("!error");
        return res.status(401).json({ message: "Token is not valid" });
    }
};

export default auth;
