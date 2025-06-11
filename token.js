const jwt=require('jsonwebtoken');
const jwtmid=(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token)
    {
        return res.status(401).json({error: 'unauthorize'});

    }
    try{
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded
        next();
    }
    catch(err)
    {
        console.log(err);
        res.status(401).json({error:'invalid token'});
    }
}
const generateToken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET);
}
module.exports={jwtmid,generateToken};