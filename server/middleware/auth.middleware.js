import jwt from 'jsonwebtoken';

export const jwtAuth = (req,res, next) => {
    
    if(!req.cookies) {res.status(403).json("Authentication failed")}
    else {
        
        const {token} = req.cookies;
        if(!token) return res.status(403).json(new Error("Authentication failed"));
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
            if(err) return res.status(403).json(err.message);
            req.user = {_id: decoded._id}
            next();
        })
    }

    
}

export const jwtAuthAdmin = (req,res, next) => {
    
    if(!req.cookies) return res.status(403).json("Authentication failed")
    
        
        const {token} = req.cookies;
        if(!token) return res.status(403).json(new Error("Authentication failed"));
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=> {
            if(err) return res.status(403).json(err.message);
            req.admin = {_id: decoded._id}
            next();
        })
    

    
}

