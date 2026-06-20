import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "user not Authorized" , success: false });
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        
        if (!decoded) { 
            return res.status(401).json({ message:"Invalid token" , success: false });
        }
        req.user = decoded;
        req.id = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "user not Authorized" , success: false });
    }
};

export default isAuthenticated;