import JWT from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization; //req.headers has authorization accept host and connection headers, and we are specifically accessing authorization
    //console.log('Middleware :', req.headers)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            status: "auth_failed",
            message: "Authentication Failed"
        });
    }

    const token = authHeader.split(" ")[1]; //String has two part, Bearer <space> token, so we split it using space and access the 2nd item(token)

    try {
        const userToken = JWT.verify(token, process.env.JWT_SECRET);
        //console.log(userToken)
        //console.log('request body',req.body)
        req.body.user = {
            userId: userToken.userID
        };
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            status: "auth_failed",
            message: "Authentication failed"
        });
    }
};

export default authMiddleware;
